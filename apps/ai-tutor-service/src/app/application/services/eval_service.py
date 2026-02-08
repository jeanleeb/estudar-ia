import json
from pathlib import Path

from app.application.ports.physics_descriptive_port import PhysicsDescriptivePort
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
                eval_case = EvalCase(**case)
                eval_cases.append(eval_case)
                if max_cases is not None and len(eval_cases) >= max_cases:
                    break
            except Exception as e:
                raise ValueError(f"Error loading eval case {index + 1}: {line}") from e

    return eval_cases


def value_ok(expected: float, predicted: float, abs_tol: float, rel_tol: float) -> bool:
    diff = abs(expected - predicted)

    is_within_abs_tol = diff <= abs_tol
    is_within_rel_tol = (diff / max(abs(expected), 1e-12)) <= rel_tol

    return is_within_abs_tol or is_within_rel_tol


unit_aliases = {
    "meter": "m",
    "meters": "m",
    "kilometer": "km",
    "kilometers": "km",
    "kilogram": "kg",
    "kilograms": "kg",
    "gram": "g",
    "grams": "g",
    "second": "s",
    "seconds": "s",
    "segundo": "s",
    "segundos": "s",
    "minute": "min",
    "minutes": "min",
    "minuto": "min",
    "minutos": "min",
    "ano": "year",
    "anos": "year",
    "year": "year",
    "years": "year",
    "hour": "h",
    "hours": "h",
    "horas": "h",
    "hora": "h",
    "ampere": "a",
    "ampères": "a",
    "amperes": "a",
    "amp": "a",
    "amps": "a",
    "kelvin": "k",
    "watt": "w",
    "watts": "w",
    "ratio": "dimensionless",
    "ohms": "ohm",
}


def normalize_unit(unit: str) -> str:
    clean_unit = unit.strip().lower().replace(" ", "")

    unaliased_unit = unit_aliases.get(clean_unit, clean_unit)

    if unaliased_unit:
        return unaliased_unit

    return clean_unit


def unit_ok(expected_unit: str, predicted_unit: str) -> bool:
    expected_unit = normalize_unit(expected_unit)
    predicted_unit = normalize_unit(predicted_unit)
    return expected_unit == predicted_unit


def score_case(case: EvalCase, predicted: PhysicsDescriptiveSolution) -> EvalCaseScore:
    value_result = value_ok(
        expected=case.expected.value,
        predicted=predicted.value,
        abs_tol=case.tolerance.abs,
        rel_tol=case.tolerance.rel,
    )
    unit_result = unit_ok(expected_unit=case.expected.unit, predicted_unit=predicted.unit)

    value_score = 1.0 if value_result else 0.0
    unit_score = 1.0 if unit_result else 0.0

    normalized_reasoning = predicted.reasoning.strip().lower()
    has_min_length = len(normalized_reasoning) >= 40
    step_markers = ["=", "logo", "portanto", "assim", "então"]
    has_step_marker = any(marker in normalized_reasoning for marker in step_markers)
    reasoning_points = sum([has_min_length, has_step_marker])
    reasoning_score = reasoning_points / 2.0

    total_score = 0.2 * value_score + 0.2 * unit_score + 0.6 * reasoning_score

    return EvalCaseScore(
        value_ok=value_result,
        unit_ok=unit_result,
        reasoning_score=reasoning_score,
        total_score=total_score,
        passed=value_result and unit_result,
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
        value_sum = 0.0
        unit_sum = 0.0
        total_sum = 0.0

        for case in self.cases:
            try:
                question = PhysicsDescriptiveQuestion(text=case.question_text)

                prediction = await self.solver.solve(question=question)

                case_score = score_case(case=case, predicted=prediction)

                case_results.append(case_score)

                passed_cases = passed_cases + 1 if case_score.passed else passed_cases
                reasoning_sum += case_score.reasoning_score
                value_sum += case_score.value_ok
                unit_sum += case_score.unit_ok
                total_sum += case_score.total_score
            except Exception as e:
                case_results.append(
                    EvalCaseScore(
                        passed=False,
                        reasoning_score=0.0,
                        value_ok=False,
                        unit_ok=False,
                        total_score=0.0,
                        error=str(e),
                    )
                )
                reasoning_sum += 0.0
                value_sum += 0.0
                unit_sum += 0.0
                total_sum += 0.0

        return EvalRunSummary(
            case_results=case_results,
            total_cases=total_cases,
            passed_cases=passed_cases,
            pass_rate=passed_cases / total_cases if total_cases > 0 else 0.0,
            avg_reasoning_score=reasoning_sum / total_cases if total_cases > 0 else 0.0,
            avg_value_score=value_sum / total_cases if total_cases > 0 else 0.0,
            avg_unit_score=unit_sum / total_cases if total_cases > 0 else 0.0,
            avg_total_score=total_sum / total_cases if total_cases > 0 else 0.0,
        )
