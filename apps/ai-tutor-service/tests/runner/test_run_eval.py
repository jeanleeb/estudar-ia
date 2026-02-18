from __future__ import annotations

import asyncio
from pathlib import Path
from types import SimpleNamespace

from app.domain.models.eval import EvalCaseScore, EvalRunSummary
from app.runner import run_eval as run_eval_module


class _FakeSpan:
    def __init__(self) -> None:
        self.attributes: dict[str, object] = {}
        self.status: object | None = None

    def __enter__(self) -> _FakeSpan:
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        return None

    def get_span_context(self):
        return SimpleNamespace(trace_id=123)

    def set_attribute(self, key, value) -> None:
        self.attributes[str(key)] = value

    def set_status(self, status) -> None:
        self.status = status


class _FakeTracer:
    def __init__(self, span: _FakeSpan) -> None:
        self._span = span

    def start_as_current_span(self, _name):
        return self._span


def _summary_with_errors(error_cases: int) -> EvalRunSummary:
    case_results: list[EvalCaseScore] = []
    for _ in range(error_cases):
        case_results.append(
            EvalCaseScore(
                expected=None,
                predicted=None,
                result_ok=False,
                reasoning_score=0.0,
                total_score=0.0,
                passed=False,
                error="rate limited",
            )
        )
    for _ in range(2):
        case_results.append(
            EvalCaseScore(
                expected="1.0 meter / second",
                predicted="1.0 meter / second",
                result_ok=True,
                reasoning_score=1.0,
                total_score=1.0,
                passed=True,
                error=None,
            )
        )

    total_cases = len(case_results)
    passed_cases = sum(1 for c in case_results if c.passed)
    return EvalRunSummary(
        case_results=case_results,
        total_cases=total_cases,
        passed_cases=passed_cases,
        evaluated_cases=total_cases,
        pass_rate=passed_cases / total_cases,
        avg_total_score=sum(c.total_score for c in case_results) / total_cases,
        avg_reasoning_score=sum(c.reasoning_score for c in case_results) / total_cases,
        avg_value_score=sum(1.0 if c.result_ok else 0.0 for c in case_results) / total_cases,
    )


def test_run_eval_returns_error_when_case_level_errors_exist(tmp_path, monkeypatch) -> None:
    span = _FakeSpan()
    dataset_path = tmp_path / "dataset.jsonl"
    dataset_path.write_text('{"id":"c1"}\n', encoding="utf-8")

    monkeypatch.setattr(run_eval_module, "init_observability", lambda: None)
    monkeypatch.setattr(run_eval_module.trace, "get_tracer", lambda _name: _FakeTracer(span))
    monkeypatch.setattr(run_eval_module, "load_cases", lambda dataset_path, max_cases: [object()])
    monkeypatch.setattr(run_eval_module, "setup_llm", lambda offline: "gemini/gemini-2.0-flash")
    monkeypatch.setattr(run_eval_module, "default_artifacts_dir", lambda: Path(tmp_path))

    class _FakeEvalService:
        def __init__(self, cases, solver) -> None:
            self._cases = cases
            self._solver = solver

        async def run(self) -> EvalRunSummary:
            return await asyncio.to_thread(_summary_with_errors, error_cases=1)

    monkeypatch.setattr(run_eval_module, "EvalService", _FakeEvalService)
    monkeypatch.setattr(run_eval_module, "PhysicsAgent", lambda: object())

    result = run_eval_module.run_eval(
        dataset=str(dataset_path),
        max_cases=None,
        offline=False,
        print_output=False,
    )

    assert result == 1
    assert span.attributes["eval.error_cases"] == 1
    assert span.attributes["error.type"] == "EvalCaseExecutionError"


def test_run_eval_returns_ok_when_no_case_level_errors(tmp_path, monkeypatch) -> None:
    span = _FakeSpan()
    dataset_path = tmp_path / "dataset.jsonl"
    dataset_path.write_text('{"id":"c1"}\n', encoding="utf-8")

    monkeypatch.setattr(run_eval_module, "init_observability", lambda: None)
    monkeypatch.setattr(run_eval_module.trace, "get_tracer", lambda _name: _FakeTracer(span))
    monkeypatch.setattr(run_eval_module, "load_cases", lambda dataset_path, max_cases: [object()])
    monkeypatch.setattr(run_eval_module, "setup_llm", lambda offline: "gemini/gemini-2.0-flash")
    monkeypatch.setattr(run_eval_module, "default_artifacts_dir", lambda: Path(tmp_path))

    class _FakeEvalService:
        def __init__(self, cases, solver) -> None:
            self._cases = cases
            self._solver = solver

        async def run(self) -> EvalRunSummary:
            return await asyncio.to_thread(_summary_with_errors, error_cases=0)

    monkeypatch.setattr(run_eval_module, "EvalService", _FakeEvalService)
    monkeypatch.setattr(run_eval_module, "PhysicsAgent", lambda: object())

    result = run_eval_module.run_eval(
        dataset=str(dataset_path),
        max_cases=None,
        offline=False,
        print_output=False,
    )

    assert result == 0
    assert span.attributes["eval.error_cases"] == 0
