import asyncio
from unittest.mock import AsyncMock, patch

import pytest

from app.application.services.eval_service import (
    EvalService,
    check_result,
    score_case,
)
from app.domain.models.eval import EvalCase
from app.domain.models.physics import PhysicsSolution

_JUDGE_PATH = "app.application.services.eval_service.judge_reasoning"


def make_case(**overrides) -> EvalCase:
    data = {
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
    data.update(overrides)
    return EvalCase.model_validate(data)


# ── score_case ──────────────────────────────────────────────────


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


# ── check_result ────────────────────────────────────────────────


def test_check_result_exact_match():
    case = make_case()
    assert check_result(case, predicted_value=10.0, predicted_unit="m/s") is True


def test_check_result_within_tolerance():
    case = make_case(tolerance={"abs": 1.0, "rel": 0.0})
    assert check_result(case, predicted_value=10.5, predicted_unit="m/s") is True


def test_check_result_outside_tolerance():
    case = make_case(tolerance={"abs": 0.01, "rel": 0.0})
    assert check_result(case, predicted_value=12.0, predicted_unit="m/s") is False


def test_check_result_unit_conversion():
    case = make_case(
        expected={"value": 36.0, "unit": "km/hr"},
        tolerance={"abs": 0.1, "rel": 0.01},
    )
    assert check_result(case, predicted_value=10.0, predicted_unit="m/s") is True


def test_check_result_incompatible_unit_returns_false():
    case = make_case()
    assert check_result(case, predicted_value=10.0, predicted_unit="kg") is False


# ── EvalService.run ─────────────────────────────────────────────


def _make_solver(solutions: list[PhysicsSolution | Exception]) -> AsyncMock:
    solver = AsyncMock()
    solver.solve = AsyncMock(side_effect=solutions)
    return solver


async def test_run_counts_evaluated_cases_excluding_errors() -> None:
    cases = [make_case(id="c1"), make_case(id="c2"), make_case(id="c3")]
    ok_solution = PhysicsSolution(reasoning="Bom raciocínio", value=10.0, unit="m/s")

    solver = _make_solver(
        [
            ok_solution,
            RuntimeError("solver exploded"),
            ok_solution,
        ]
    )

    with patch(_JUDGE_PATH, AsyncMock(return_value=0.8)):
        svc = EvalService(cases=cases, solver=solver)
        summary = await svc.run()

    assert summary.total_cases == 3
    assert summary.evaluated_cases == 2
    assert len(summary.case_results) == 3
    assert summary.case_results[1].error == "solver exploded"
    assert summary.avg_reasoning_score == pytest.approx(0.8)


async def test_run_judge_unavailable_excluded_from_metrics() -> None:
    cases = [make_case(id="c1"), make_case(id="c2")]
    ok_solution = PhysicsSolution(reasoning="Raciocínio", value=10.0, unit="m/s")

    solver = _make_solver([ok_solution, ok_solution])

    judge_returns = [0.9, None]
    with patch(_JUDGE_PATH, AsyncMock(side_effect=judge_returns)):
        svc = EvalService(cases=cases, solver=solver)
        summary = await svc.run()

    assert summary.total_cases == 2
    assert summary.evaluated_cases == 1
    assert summary.case_results[1].error == "LLM judge unavailable — case discarded"


async def test_run_all_cases_fail_returns_zero_metrics() -> None:
    cases = [make_case(id="c1"), make_case(id="c2")]
    solver = _make_solver([RuntimeError("boom"), RuntimeError("boom")])

    svc = EvalService(cases=cases, solver=solver)
    summary = await svc.run()

    assert summary.total_cases == 2
    assert summary.evaluated_cases == 0
    assert summary.pass_rate == pytest.approx(0.0)
    assert summary.avg_total_score == pytest.approx(0.0)


# ── EvalService.run – timeout ──────────────────────────────────


async def test_run_timeout_excluded_from_metrics(monkeypatch) -> None:
    monkeypatch.setattr("app.application.services.eval_service.CASE_TIMEOUT_SECONDS", 0.05)
    cases = [make_case(id="c1"), make_case(id="c2")]
    ok_solution = PhysicsSolution(reasoning="Raciocínio", value=10.0, unit="m/s")

    call_count = 0

    async def _solve_side_effect(*, question):
        nonlocal call_count
        call_count += 1
        if call_count == 2:
            await asyncio.sleep(1)
        return ok_solution

    solver = AsyncMock()
    solver.solve = _solve_side_effect

    with patch(_JUDGE_PATH, AsyncMock(return_value=0.8)):
        svc = EvalService(cases=cases, solver=solver)
        summary = await svc.run()

    assert summary.total_cases == 2
    assert summary.evaluated_cases == 1
    assert summary.case_results[1].error == "TimeoutError: exceeded 0.05s"
