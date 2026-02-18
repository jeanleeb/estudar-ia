"""LLM-as-Judge for evaluating PhysicsAgent reasoning quality.

The judge evaluates reasoning across N criteria on a 1-5 scale, returning a
normalized score from 0.0 to 1.0. The EvalCase's `reasoning_rubric` is provided
as additional context when available.
"""

from __future__ import annotations

import logging

import httpx
from openinference.semconv.trace import SpanAttributes
from opentelemetry import trace
from pydantic import BaseModel, ValidationError

from app.core.observability_contract import AttrKey, SpanName
from app.core.settings import get_settings
from app.domain.models.eval import ReferenceData

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

_MAX_SCORE = 5

# Score = mean(scores) / MAX_SCORE, normalized to 0.0–1.0.
_JUDGE_CRITERIA = [
    "Introdução contextual da resolução",
    "Identificação explícita dos princípios/leis usados",
    "Eficiência (sem passos desnecessários ou redundantes)",
    "Coesão entre os passos do raciocínio (conexão lógica entre passos)",
    "Clareza didática (explicação como um professor faria)",
]

_criteria_block = "\n".join(f"{i}. {c}" for i, c in enumerate(_JUDGE_CRITERIA, 1))
_n = len(_JUDGE_CRITERIA)
_example_scores = [3] * _n

_SYSTEM_PROMPT = f"""\
Você é um avaliador de resoluções de física. Avalie o raciocínio apresentado \
segundo exatamente {_n} critérios, usando uma escala de 1 a {_MAX_SCORE} para cada.

Escala:
1 = muito fraco, 2 = fraco, 3 = adequado, 4 = bom, 5 = excelente

Os critérios são:
{_criteria_block}

Aceite caminhos matematicamente equivalentes, incluindo simplificações algébricas e uso de unidades diferentes,
desde que o raciocínio seja coerente e lógico.

Responda APENAS com um objeto JSON válido no seguinte formato:
{{"scores": {_example_scores}, "reason": "explicação curta em uma frase"}}

O array "scores" deve ter exatamente {_n} inteiros (1-{_MAX_SCORE}), um por critério, na ordem acima.
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
Avalie o raciocínio segundo os {_n} critérios definidos, com notas de 1 a {_MAX_SCORE}.\
"""

_RUBRIC_SECTION = """
CRITÉRIOS ESPECÍFICOS DA QUESTÃO (use como contexto adicional na avaliação):
{rubric_items}
"""


class JudgeResponse(BaseModel):
    scores: list[int]
    reason: str = ""


def _format_reference_constants(reference_data: ReferenceData | None) -> str:
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
    reference_data: ReferenceData | None = None,
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
        _n=_n,
        _MAX_SCORE=_MAX_SCORE,
    )


async def judge_reasoning(
    *,
    question: str,
    value: float,
    unit: str,
    reasoning: str,
    rubric: list[str],
    reference_data: ReferenceData | None = None,
    model: str | None = None,
    base_url: str | None = None,
    request_timeout: float = 30.0,
) -> float | None:
    """Call Ollama to evaluate reasoning quality.

    Returns a score from 0.0 to 1.0 (normalized average across all criteria),
    or None if the judge is unavailable.
    """
    settings = get_settings()
    judge_base_url = base_url or settings.ollama_base_url
    judge_model = model or settings.ollama_judge_model

    payload = {
        "model": judge_model,
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
        span.set_attribute(AttrKey.JUDGE_MODEL, judge_model)

        try:
            async with httpx.AsyncClient(
                base_url=judge_base_url, timeout=request_timeout
            ) as client:
                response = await client.post("/api/chat", json=payload)
                response.raise_for_status()

            raw_content = response.json()["message"]["content"].strip()

            try:
                judge_response = JudgeResponse.model_validate_json(raw_content)
            except ValidationError as exc:
                logger.warning("[judge] Invalid judge response format: %s", exc)
                return None

            scores = judge_response.scores

            if len(scores) != _n:
                logger.warning(
                    "[judge] Unexpected scores length: got %d, expected %d",
                    len(scores),
                    _n,
                )
                return None

            if not all(1 <= s <= _MAX_SCORE for s in scores):
                logger.warning("[judge] Scores out of range 1-%d: %s", _MAX_SCORE, scores)
                return None

            score = sum(scores) / (_n * _MAX_SCORE)
            judge_reason = judge_response.reason

            span.set_attribute(SpanAttributes.OUTPUT_VALUE, raw_content)
            span.set_attribute(SpanAttributes.OUTPUT_MIME_TYPE, "application/json")
            span.set_attribute(AttrKey.JUDGE_SCORE, score)
            span.set_attribute(AttrKey.JUDGE_CRITERIA, str(scores))
            span.set_attribute(AttrKey.JUDGE_REASON, judge_reason)

            logger.debug(
                "[judge] score=%.2f criteria=%s reason=%s",
                score,
                scores,
                judge_reason,
            )
            return score

        except httpx.ConnectError:
            logger.warning("[judge] Ollama not available at %s — skipping judge", judge_base_url)
            span.set_status(trace.Status(trace.StatusCode.ERROR, "Ollama unavailable"))
            return None
        except Exception as e:
            logger.warning("[judge] Failed to evaluate reasoning: %s", e)
            span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
            span.record_exception(e)
            return None
