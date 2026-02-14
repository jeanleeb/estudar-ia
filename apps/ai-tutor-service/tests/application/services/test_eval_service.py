import pytest

from app.application.services.eval_service import score_case
from app.domain.models.eval import EvalCase
from app.domain.models.physics import PhysicsDescriptiveSolution


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


def test_score_case_perfect() -> None:
    case = make_case()
    predicted = PhysicsDescriptiveSolution(
        reasoning="Usamos v = delta_s/delta_t, logo o valor final é 10 m/s.",
        value=10.0,
        unit="m/s",
    )

    result = score_case(case, predicted)

    assert result.result_ok is True
    assert result.reasoning_score == pytest.approx(1.0)
    assert result.total_score == pytest.approx(1.0)
    assert result.passed is True


def test_score_case_incorrect_value_good_reasoning() -> None:
    case = make_case()
    predicted = PhysicsDescriptiveSolution(
        reasoning="O espaço deslocado é = 100 metros, logo, podemos considerar que ele andou 100 metros! Muito bom. Por fim, concluimos que, fazendo delta s sobre delta t, chegamos na resposta em metros por segundo!!!",
        value=11.0,
        unit="km/h",
    )

    result = score_case(case, predicted)

    assert result.result_ok is False
    assert result.reasoning_score == pytest.approx(1.0)
    assert result.total_score == pytest.approx(0.6)
    assert result.passed is False


def test_score_case_correct_value_bad_reasoning() -> None:
    case = make_case()
    predicted = PhysicsDescriptiveSolution(
        reasoning="Se vira aí",
        value=10.0,
        unit="m/s",
    )

    result = score_case(case, predicted)

    assert result.result_ok is True
    assert result.reasoning_score == pytest.approx(0.0)
    assert result.total_score == pytest.approx(0.4)
    assert result.passed is True
