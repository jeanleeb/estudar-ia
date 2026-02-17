from unittest.mock import AsyncMock, patch

import pytest

from app.application.services.eval_service import score_case
from app.domain.models.eval import EvalCase
from app.domain.models.physics import PhysicsSolution

_JUDGE_PATH = "app.application.services.eval_service.judge_reasoning"


def make_case() -> EvalCase:
    return EvalCase.model_validate(
        {
            "id": "case-1",
            "source": {"exam": "fuvest", "year": 2024, "phase": 2, "question": "F00a"},
            "subject": "physics",
            "topics": ["kinematics"],
            "difficulty": "easy",
            "split": "dev",
            "question_text": "Pergunta",
            "expected": {"value": 10.0, "unit": "m/s"},
            "tolerance": {"abs": 0.1, "rel": 0.01},
            "reasoning_rubric": ["criterio"],
        }
    )


async def test_score_case_perfect() -> None:
    case = make_case()
    predicted = PhysicsSolution(
        reasoning="Usamos v = delta_s/delta_t, logo o valor final é 10 m/s.",
        value=10.0,
        unit="m/s",
    )

    with patch(_JUDGE_PATH, AsyncMock(return_value=1.0)):
        result = await score_case(case, predicted)

    assert result.result_ok is True
    assert result.reasoning_score == pytest.approx(1.0)
    assert result.total_score == pytest.approx(1.0)
    assert result.passed is True


async def test_score_case_incorrect_value_good_reasoning() -> None:
    case = make_case()
    predicted = PhysicsSolution(
        reasoning="O espaço deslocado é = 100 metros, logo, podemos considerar que ele andou 100 metros! Muito bom. Por fim, concluimos que, fazendo delta s sobre delta t, chegamos na resposta em metros por segundo!!!",
        value=11.0,
        unit="km/h",
    )

    with patch(_JUDGE_PATH, AsyncMock(return_value=1.0)):
        result = await score_case(case, predicted)

    assert result.result_ok is False
    assert result.reasoning_score == pytest.approx(1.0)
    assert result.total_score == pytest.approx(0.6)
    assert result.passed is False


async def test_score_case_correct_value_bad_reasoning() -> None:
    case = make_case()
    predicted = PhysicsSolution(
        reasoning="Se vira aí",
        value=10.0,
        unit="m/s",
    )

    with patch(_JUDGE_PATH, AsyncMock(return_value=0.0)):
        result = await score_case(case, predicted)

    assert result.result_ok is True
    assert result.reasoning_score == pytest.approx(0.0)
    assert result.total_score == pytest.approx(0.4)
    assert result.passed is True


async def test_score_case_judge_unavailable_raises() -> None:
    case = make_case()
    predicted = PhysicsSolution(reasoning="Qualquer reasoning", value=10.0, unit="m/s")

    with patch(_JUDGE_PATH, AsyncMock(return_value=None)):
        with pytest.raises(RuntimeError, match="LLM judge unavailable"):
            await score_case(case, predicted)
