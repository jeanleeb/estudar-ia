import asyncio
import traceback
from datetime import UTC, datetime

from openinference.semconv.trace import SpanAttributes
from opentelemetry import trace

from app.application.services.physics_descriptive_service import PhysicsDescriptiveService
from app.core.observability import init_observability
from app.core.observability_contract import AttrKey, SpanKind, SpanName
from app.data.agents.physics_descriptive_agent import PhysicsDescriptiveAgent
from app.domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution
from app.runner.artifact import default_artifacts_dir, extract_raw_output
from app.runner.run_artifact import RunArtifact, RunError
from app.runner.utils import setup_llm


def _utcnow() -> datetime:
    return datetime.now(tz=UTC)


async def _run_physics_descriptive(question_text: str) -> PhysicsDescriptiveSolution:
    agent = PhysicsDescriptiveAgent()
    service = PhysicsDescriptiveService(agent)
    return await service.solve_once(PhysicsDescriptiveQuestion(text=question_text))


def run_case(*, agent: str, question: str, offline: bool, print_output: bool) -> int:
    init_observability()

    started_at = _utcnow()
    tracer = trace.get_tracer(__name__)

    with tracer.start_as_current_span(
        SpanName.RUNNER_RUN_CASE,
    ) as span:
        trace_id = format(span.get_span_context().trace_id, "032x")
        span.set_attribute(AttrKey.TRACE_ID, trace_id)
        span.set_attribute(AttrKey.OFFLINE, offline)
        span.set_attribute(SpanAttributes.AGENT_NAME, agent)
        span.set_attribute(SpanAttributes.OPENINFERENCE_SPAN_KIND, SpanKind.CHAIN)

        llm_name = setup_llm(offline=offline)
        span.set_attribute(SpanAttributes.LLM_MODEL_NAME, llm_name)

        raw_output: str | None = None
        validated_output: PhysicsDescriptiveSolution | None = None
        run_error: RunError | None = None
        traceback_str: str | None = None

        try:
            if agent != "physics_descriptive":
                raise ValueError(f"Unsupported agent: {agent}")

            validated_output = asyncio.run(_run_physics_descriptive(question))
            raw_output = extract_raw_output()

            finished_at = _utcnow()
            duration_ms = int((finished_at - started_at).total_seconds() * 1000)

            artifact = RunArtifact(
                trace_id=trace_id,
                started_at=started_at,
                finished_at=finished_at,
                duration_ms=duration_ms,
                agent=str(agent),
                llm_name=llm_name,
                input=PhysicsDescriptiveQuestion(text=str(question)),
                raw_output=raw_output,
                validated_output=validated_output,
                error=run_error,
            )
        except Exception as exc:  # noqa: BLE001 - want artifact even on failure
            raw_output = extract_raw_output()
            run_error = RunError(type=type(exc).__name__, message=str(exc) or repr(exc))
            traceback_str = traceback.format_exc()

            span.set_attribute(AttrKey.ERROR_TYPE, type(exc).__name__)
            span.set_attribute(AttrKey.ERROR_MESSAGE, str(exc) or repr(exc))
            span.set_status(trace.StatusCode.ERROR)

            finished_at = _utcnow()
            duration_ms = int((finished_at - started_at).total_seconds() * 1000)

            artifact = RunArtifact(
                trace_id=trace_id,
                started_at=started_at,
                finished_at=finished_at,
                duration_ms=duration_ms,
                agent=str(agent),
                llm_name=llm_name,
                input=PhysicsDescriptiveQuestion(text=str(question)),
                raw_output=raw_output,
                validated_output=validated_output,
                error=run_error,
            )

        out_path = default_artifacts_dir() / started_at.date().isoformat() / f"{trace_id}.json"

        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(artifact.model_dump_json(indent=2), encoding="utf-8")

        if run_error is not None:
            # Help debugging without losing the artifact.
            print("Execution failed. Artifact saved to:", out_path)
            print("Error:", run_error.type, "-", run_error.message)
            if traceback_str is not None:
                print("Traceback:")
                print(traceback_str)
            return 1

        print("OK. Artifact saved to:", out_path)
        span.set_status(trace.StatusCode.OK)
        if print_output and validated_output is not None:
            print(validated_output.model_dump_json(indent=2))
        return 0
