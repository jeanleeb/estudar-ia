import asyncio
import logging
from datetime import UTC, datetime
from pathlib import Path

from openinference.semconv.trace import SpanAttributes
from opentelemetry import trace

from app.application.services.eval_service import EvalService, load_cases
from app.core.observability import init_observability
from app.core.observability_contract import AttrKey, SpanName
from app.data.agents.physics_agent import PhysicsAgent
from app.runner.artifact import default_artifacts_dir
from app.runner.run_artifact import EvalRunArtifact
from app.runner.utils import setup_llm

logger = logging.getLogger(__name__)


def _utcnow() -> datetime:
    return datetime.now(tz=UTC)


def run_eval(
    *,
    dataset: str,
    max_cases: int | None,
    offline: bool,
    print_output: bool,
) -> int:
    init_observability()
    started_at = _utcnow()
    tracer = trace.get_tracer(__name__)

    with tracer.start_as_current_span(SpanName.EVAL_RUN) as span:
        trace_id = format(span.get_span_context().trace_id, "032x")
        span.set_attribute(AttrKey.TRACE_ID, trace_id)
        span.set_attribute(AttrKey.OFFLINE, offline)
        span.set_attribute(AttrKey.DATASET_PATH, dataset)
        span.set_attribute(SpanAttributes.OPENINFERENCE_SPAN_KIND, "EVALUATOR")
        if max_cases is not None:
            span.set_attribute(AttrKey.EVAL_MAX_CASES, max_cases)

        llm_name = setup_llm(offline=offline)
        span.set_attribute(SpanAttributes.LLM_MODEL_NAME, llm_name)

        try:
            cases = load_cases(dataset_path=Path(dataset), max_cases=max_cases)
            eval_service = EvalService(
                cases=cases,
                solver=PhysicsAgent(),
            )
            run_summary = asyncio.run(eval_service.run())
        except Exception as e:
            span.record_exception(e)
            span.set_attribute(AttrKey.ERROR_TYPE, type(e).__name__)
            span.set_attribute(AttrKey.ERROR_MESSAGE, str(e) or repr(e))
            span.set_status(trace.StatusCode.ERROR)

            logger.error(
                "[eval] failed trace_id=%s dataset='%s' max_cases=%s error_type=%s error='%s'",
                trace_id,
                dataset,
                max_cases,
                type(e).__name__,
                e,
            )
            return 1

        finished_at = _utcnow()
        duration_ms = round((finished_at - started_at).total_seconds() * 1000)
        artifact = EvalRunArtifact(
            trace_id=trace_id,
            started_at=started_at,
            finished_at=finished_at,
            duration_ms=duration_ms,
            dataset_path=dataset,
            llm_name=llm_name,
            run_summary=run_summary,
        )

        out_path = default_artifacts_dir() / "evals" / f"{trace_id}.json"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(artifact.model_dump_json(indent=2), encoding="utf-8")
        logger.info("Artifact saved to: %s", out_path)

        error_cases = sum(
            1 for case_result in run_summary.case_results if case_result.error is not None
        )
        span.set_attribute(AttrKey.EVAL_TOTAL_CASES, run_summary.total_cases)
        span.set_attribute(AttrKey.EVAL_ERROR_CASES, error_cases)

        if error_cases > 0:
            error_message = (
                f"Eval completed with case-level errors: {error_cases}/{run_summary.total_cases}"
            )
            span.set_attribute(AttrKey.ERROR_TYPE, "EvalCaseExecutionError")
            span.set_attribute(AttrKey.ERROR_MESSAGE, error_message)
            span.set_status(trace.StatusCode.ERROR)
            logger.warning(
                "[eval] completed with errors trace_id=%s dataset='%s' error_cases=%s/%s",
                trace_id,
                dataset,
                error_cases,
                run_summary.total_cases,
            )
        else:
            span.set_status(trace.StatusCode.OK)

        if print_output:
            print(run_summary.model_dump_json(indent=2))

        return 1 if error_cases > 0 else 0
