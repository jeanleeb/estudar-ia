import json
from pathlib import Path

from app.application.ports.physics_descriptive_port import PhysicsDescriptivePort
from app.core.unit_registry import UnitQuantity
from app.domain.models.eval import EvalCase, EvalCaseScore, EvalRunSummary
from app.domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution


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
        is_within_rel_tolerance = diff <= case.tolerance.rel * normalized_expected

        return is_within_rel_tolerance
    except Exception:
        return False


def score_case(case: EvalCase, predicted: PhysicsDescriptiveSolution) -> EvalCaseScore:
    expected_value = case.expected.value
    expected_unit = case.expected.unit
    normalized_expected = UnitQuantity(f"{expected_value} {expected_unit}")
    normalized_predicted = UnitQuantity(f"{predicted.value} {predicted.unit}")
    result_ok = check_result(
        case=case,
        predicted_value=predicted.value,
        predicted_unit=predicted.unit,
    )
    result_score = 1.0 if result_ok else 0.0

    normalized_reasoning = predicted.reasoning.strip()
    has_min_length = len(normalized_reasoning) >= 40
    step_markers = ["=", "logo", "portanto", "assim", "então"]
    has_step_marker = any(marker in normalized_reasoning for marker in step_markers)
    reasoning_points = sum([has_min_length, has_step_marker])
    reasoning_score = reasoning_points / 2.0

    total_score = 0.4 * result_score + 0.6 * reasoning_score

    return EvalCaseScore(
        expected=f"{normalized_expected}",
        predicted=f"{normalized_predicted}",
        reasoning=normalized_reasoning,
        result_ok=result_ok,
        reasoning_score=reasoning_score,
        total_score=total_score,
        passed=result_ok,
    )


class EvalService:
    def __init__(self, cases: list[EvalCase], solver: PhysicsDescriptivePort):
        self.solver = solver
        self.cases = cases

    async def run(self) -> EvalRunSummary:
        case_results: list[EvalCaseScore] = []

        total_cases = len(self.cases)
        passed_cases = 0
        reasoning_sum = 0.0
        result_sum = 0.0
        unit_sum = 0.0
        total_sum = 0.0

        for case in self.cases:
            try:
                question = PhysicsDescriptiveQuestion(
                    text=case.question_text, reference_data=case.reference_data
                )

                prediction = await self.solver.solve(question=question)
                case_score = score_case(case=case, predicted=prediction)

                case_results.append(case_score)

                passed_cases = passed_cases + 1 if case_score.passed else passed_cases
                reasoning_sum += case_score.reasoning_score
                result_sum += case_score.result_ok
                total_sum += case_score.total_score
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
                unit_sum += 0.0
                total_sum += 0.0

        return EvalRunSummary(
            case_results=case_results,
            total_cases=total_cases,
            passed_cases=passed_cases,
            pass_rate=passed_cases / total_cases if total_cases > 0 else 0.0,
            avg_reasoning_score=reasoning_sum / total_cases if total_cases > 0 else 0.0,
            avg_value_score=result_sum / total_cases if total_cases > 0 else 0.0,
            avg_unit_score=unit_sum / total_cases if total_cases > 0 else 0.0,
            avg_total_score=total_sum / total_cases if total_cases > 0 else 0.0,
        )
