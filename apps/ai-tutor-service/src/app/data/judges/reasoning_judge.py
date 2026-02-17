"""LLM-as-Judge for evaluating PhysicsAgent reasoning quality.

Default model: gemma3:4b — fast enough to not significantly slow down eval runs.

The judge evaluates reasoning across 3 fixed binary criteria, returning a score
from 0.0 to 1.0 (fraction of criteria met). The EvalCase's `reasoning_rubric`
is provided as additional context when available.
"""

from __future__ import annotations

import json
import logging

import httpx

from app.core.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

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

Responda APENAS com um objeto JSON válido no seguinte formato:
{{"criteria": [true, false, true], "reason": "explicação curta em uma frase"}}

O array "criteria" deve ter exatamente 3 elementos booleanos, um por critério, na ordem acima.
Não inclua nenhum texto fora do JSON.\
"""

_USER_PROMPT_TEMPLATE = """\
PROBLEMA:
{question}

RESULTADO OBTIDO: {value} {unit}

RACIOCÍNIO APRESENTADO:
{reasoning}
{rubric_section}
Avalie o raciocínio segundo os 3 critérios definidos.\
"""

_RUBRIC_SECTION = """
CRITÉRIOS ESPECÍFICOS DA QUESTÃO (use como contexto adicional na avaliação):
{rubric_items}
"""


def _build_user_prompt(
    question: str, value: float, unit: str, reasoning: str, rubric: list[str]
) -> str:
    rubric_section = ""
    if rubric:
        rubric_items = "\n".join(f"- {item}" for item in rubric)
        rubric_section = _RUBRIC_SECTION.format(rubric_items=rubric_items)

    return _USER_PROMPT_TEMPLATE.format(
        question=question,
        value=value,
        unit=unit,
        reasoning=reasoning,
        rubric_section=rubric_section,
    )


async def judge_reasoning(
    *,
    question: str,
    value: float,
    unit: str,
    reasoning: str,
    rubric: list[str],
    model: str = settings.ollama_judge_model,
    base_url: str = settings.ollama_base_url,
    request_timeout: float = 30.0,
) -> float | None:
    """Call Ollama to evaluate reasoning quality.

    Returns a score from 0.0 to 1.0 (fraction of the 3 criteria met),
    or None if the judge is unavailable.
    """
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {
                "role": "user",
                "content": _build_user_prompt(question, value, unit, reasoning, rubric),
            },
        ],
        "stream": False,
        "options": {"temperature": 0},
    }

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
        logger.debug(
            "[judge] score=%.2f criteria=%s reason=%s", score, criteria, parsed.get("reason", "")
        )
        return score

    except httpx.ConnectError:
        logger.warning("[judge] Ollama not available at %s — skipping judge", base_url)
        return None
    except Exception as e:
        logger.warning("[judge] Failed to evaluate reasoning: %s", e)
        return None
