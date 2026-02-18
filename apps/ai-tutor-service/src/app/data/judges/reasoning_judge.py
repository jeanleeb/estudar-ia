"""LLM-as-Judge for evaluating PhysicsAgent reasoning quality.

Default model: gemma3:4b — fast enough to not significantly slow down eval runs.

The judge evaluates reasoning across 3 fixed binary criteria, returning a score
from 0.0 to 1.0 (fraction of criteria met). The EvalCase's `reasoning_rubric`
is provided as additional context when available.
"""

from __future__ import annotations

import json
import logging
from typing import Any

import httpx
from openinference.semconv.trace import SpanAttributes
from opentelemetry import trace

from app.core.observability_contract import AttrKey, SpanName
from app.core.settings import get_settings

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

# Fixed 3-criteria schema keeps score comparable across all cases.
# Score = sum(criteria) / 3, regardless of rubric availability.
_JUDGE_CRITERIA = [
    "utiliza as equações ou leis físicas corretas",
    "aplica os valores numéricos corretamente",
    "chega à conclusão por meio de um raciocínio coerente passo a passo",
]

_SYSTEM_PROMPT = f"""\
Você é um avaliador de resoluções de física. Avalie o raciocínio apresentado \
segundo exatamente 3 critérios e responda com um objeto JSON.

Os critérios são:
1. {_JUDGE_CRITERIA[0]}
2. {_JUDGE_CRITERIA[1]}
3. {_JUDGE_CRITERIA[2]}

Aceite caminhos matematicamente equivalentes, incluindo simplificações algébricas e uso de unidades diferentes,
desde que o raciocínio seja coerente e lógico.

Responda APENAS com um objeto JSON válido no seguinte formato:
{{"criteria": [true, false, true], "reason": "explicação curta em uma frase"}}

O array "criteria" deve ter exatamente 3 elementos booleanos, um por critério, na ordem acima.
Não inclua nenhum texto fora do JSON.\
"""

_USER_PROMPT_TEMPLATE = """\
PROBLEMA:
{question}
{reference_section}
RESULTADO OBTIDO: {value} {unit}
(Nota: o valor numérico já foi verificado. Avalie apenas a qualidade do raciocínio.)

RACIOCÍNIO APRESENTADO:
{reasoning}
{rubric_section}
Avalie o raciocínio segundo os 3 critérios definidos.\
"""

_RUBRIC_SECTION = """
CRITÉRIOS ESPECÍFICOS DA QUESTÃO (use como contexto adicional na avaliação):
{rubric_items}
"""


def _format_reference_constants(reference_data: dict[str, Any] | None) -> str:
    if not reference_data:
        return ""
    constants = reference_data.get("constants", [])
    if not constants:
        return ""
    items = ", ".join(f"{c['symbol']} = {c['value']} {c['unit']}" for c in constants)
    return f"\nDADOS DO ENUNCIADO: {items}"


def _build_user_prompt(
    question: str,
    value: float,
    unit: str,
    reasoning: str,
    rubric: list[str],
    reference_data: dict[str, Any] | None = None,
) -> str:
    rubric_section = ""
    if rubric:
        rubric_items = "\n".join(f"- {item}" for item in rubric)
        rubric_section = _RUBRIC_SECTION.format(rubric_items=rubric_items)

    reference_section = _format_reference_constants(reference_data)

    return _USER_PROMPT_TEMPLATE.format(
        question=question,
        value=value,
        unit=unit,
        reasoning=reasoning,
        rubric_section=rubric_section,
        reference_section=reference_section,
    )


async def judge_reasoning(
    *,
    question: str,
    value: float,
    unit: str,
    reasoning: str,
    rubric: list[str],
    reference_data: dict[str, Any] | None = None,
    request_timeout: float = 30.0,
) -> float | None:
    """Call Ollama to evaluate reasoning quality.

    Returns a score from 0.0 to 1.0 (fraction of the 3 criteria met),
    or None if the judge is unavailable.
    """
    settings = get_settings()
    base_url = settings.ollama_base_url
    model = settings.ollama_judge_model

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {
                "role": "user",
                "content": _build_user_prompt(
                    question, value, unit, reasoning, rubric, reference_data
                ),
            },
        ],
        "stream": False,
        "format": "json",
        "options": {"temperature": 0},
    }

    user_prompt = payload["messages"][1]["content"]

    with tracer.start_as_current_span(SpanName.JUDGE_REASONING) as span:
        span.set_attribute(SpanAttributes.OPENINFERENCE_SPAN_KIND, "EVALUATOR")
        span.set_attribute(SpanAttributes.INPUT_VALUE, user_prompt)
        span.set_attribute(SpanAttributes.INPUT_MIME_TYPE, "text/plain")
        span.set_attribute(AttrKey.JUDGE_MODEL, model)

        try:
            async with httpx.AsyncClient(base_url=base_url, timeout=request_timeout) as client:
                response = await client.post("/api/chat", json=payload)
                response.raise_for_status()

            content = response.json()["message"]["content"].strip()
            parsed = json.loads(content)
            criteria: list[bool] = parsed["criteria"]

            if len(criteria) != len(_JUDGE_CRITERIA):
                logger.warning(
                    "[judge] Unexpected criteria length: got %d, expected %d",
                    len(criteria),
                    len(_JUDGE_CRITERIA),
                )
                return None

            score = sum(criteria) / len(_JUDGE_CRITERIA)

            judge_reason = parsed.get("reason", "")

            span.set_attribute(SpanAttributes.OUTPUT_VALUE, content)
            span.set_attribute(SpanAttributes.OUTPUT_MIME_TYPE, "application/json")
            span.set_attribute(AttrKey.JUDGE_SCORE, score)
            span.set_attribute(AttrKey.JUDGE_CRITERIA, str(criteria))
            span.set_attribute(AttrKey.JUDGE_REASON, judge_reason)

            logger.debug(
                "[judge] score=%.2f criteria=%s reason=%s",
                score,
                criteria,
                judge_reason,
            )
            return score

        except httpx.ConnectError:
            logger.warning("[judge] Ollama not available at %s — skipping judge", base_url)
            span.set_status(trace.StatusCode.ERROR, "Ollama unavailable")
            return None
        except Exception as e:
            logger.warning("[judge] Failed to evaluate reasoning: %s", e)
            span.set_status(trace.StatusCode.ERROR, str(e))
            span.record_exception(e)
            return None
