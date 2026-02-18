import asyncio
import json
import logging
from pathlib import Path

from app.application.ports.physics_port import PhysicsPort
from app.core.unit_registry import UnitQuantity
from app.data.judges.reasoning_judge import judge_reasoning
from app.domain.models.eval import EvalCase, EvalCaseScore, EvalRunSummary
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution

logger = logging.getLogger(__name__)

CASE_TIMEOUT_SECONDS = 120


def load_cases(dataset_path: Path, max_cases: int | None = None):
    eval_cases: list[EvalCase] = []
    with open(dataset_path, encoding="utf-8") as dataset:
        for index, line in enumerate(dataset):
            try:
                line = line.strip()
                if not line:
                    continue
                case = json.loads(line)
                if not case:
                    continue
                if max_cases is not None and len(eval_cases) >= max_cases:
                    break

                eval_case = EvalCase(**case)
                eval_cases.append(eval_case)

            except Exception as e:
                raise ValueError(f"Error loading eval case {index + 1}: {line}") from e

    return eval_cases


def check_result(
    case: EvalCase,
    predicted_value: int | float,
    predicted_unit: str,
) -> bool:
    try:
        expected_value = case.expected.value
        expected_unit = case.expected.unit

        normalized_expected = UnitQuantity(f"{expected_value} {expected_unit}")
        normalized_predicted = UnitQuantity(f"{predicted_value} {predicted_unit}")
        diff = abs(normalized_expected - normalized_predicted)
        abs_tolerance = UnitQuantity(f"{case.tolerance.abs} {expected_unit}")
        tolerance_band = abs_tolerance + case.tolerance.rel * abs(normalized_expected)

        return bool(diff <= tolerance_band)
    except Exception:
        return False


async def score_case(case: EvalCase, predicted: PhysicsSolution) -> EvalCaseScore:
    expected_value = case.expected.value
    expected_unit = case.expected.unit

    try:
        expected_str = f"{UnitQuantity(f'{expected_value} {expected_unit}')}"
    except Exception:
        expected_str = f"{expected_value} {expected_unit}"

    try:
        predicted_str = f"{UnitQuantity(f'{predicted.value} {predicted.unit}')}"
    except Exception:
        predicted_str = f"{predicted.value} {predicted.unit}"

    result_ok = check_result(
        case=case,
        predicted_value=predicted.value,
        predicted_unit=predicted.unit,
    )
    result_score = 1.0 if result_ok else 0.0

    normalized_reasoning = predicted.reasoning.strip()

    reasoning_score = await judge_reasoning(
        question=case.question_text,
        value=predicted.value,
        unit=predicted.unit,
        reasoning=predicted.reasoning,
        rubric=case.reasoning_rubric,
        reference_data=case.reference_data,
    )

    if reasoning_score is None:
        raise RuntimeError("LLM judge unavailable — case discarded")

    total_score = 0.4 * result_score + 0.6 * reasoning_score

    return EvalCaseScore(
        expected=expected_str,
        predicted=predicted_str,
        reasoning=normalized_reasoning,
        result_ok=result_ok,
        reasoning_score=reasoning_score,
        total_score=total_score,
        passed=result_ok,
    )


class EvalService:
    def __init__(
        self,
        cases: list[EvalCase],
        solver: PhysicsPort,
    ):
        self.solver = solver
        self.cases = cases

    async def run(self) -> EvalRunSummary:
        case_results: list[EvalCaseScore] = []

        total_cases = len(self.cases)
        passed_cases = 0
        reasoning_sum = 0.0
        result_sum = 0.0
        total_sum = 0.0

        for case in self.cases:
            try:
                question = PhysicsQuestion(
                    text=case.question_text, reference_data=case.reference_data
                )

                async with asyncio.timeout(CASE_TIMEOUT_SECONDS):
                    prediction = await self.solver.solve(question=question)

                case_score = await score_case(case=case, predicted=prediction)

                case_results.append(case_score)

                passed_cases = passed_cases + 1 if case_score.passed else passed_cases
                reasoning_sum += case_score.reasoning_score
                result_sum += case_score.result_ok
                total_sum += case_score.total_score
            except TimeoutError:
                logger.warning(
                    "[eval] case timed out after %ss: %s",
                    CASE_TIMEOUT_SECONDS,
                    case.question_text[:80],
                )
                case_results.append(
                    EvalCaseScore(
                        passed=False,
                        reasoning_score=0.0,
                        result_ok=False,
                        total_score=0.0,
                        error=f"TimeoutError: exceeded {CASE_TIMEOUT_SECONDS}s",
                    )
                )
            except Exception as e:
                case_results.append(
                    EvalCaseScore(
                        passed=False,
                        reasoning_score=0.0,
                        result_ok=False,
                        total_score=0.0,
                        error=str(e),
                    )
                )
                reasoning_sum += 0.0
                result_sum += 0.0
                total_sum += 0.0

        return EvalRunSummary(
            case_results=case_results,
            total_cases=total_cases,
            passed_cases=passed_cases,
            pass_rate=passed_cases / total_cases if total_cases > 0 else 0.0,
            avg_reasoning_score=reasoning_sum / total_cases if total_cases > 0 else 0.0,
            avg_value_score=result_sum / total_cases if total_cases > 0 else 0.0,
            avg_total_score=total_sum / total_cases if total_cases > 0 else 0.0,
        )
