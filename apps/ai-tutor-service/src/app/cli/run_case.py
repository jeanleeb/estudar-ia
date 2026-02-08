import asyncio
import traceback
import uuid
from datetime import UTC, datetime

import dspy

from app.application.services.physics_descriptive_service import PhysicsDescriptiveService
from app.cli.artifact import default_artifacts_dir, extract_raw_output
from app.cli.run_artifact import RunArtifact, RunError
from app.core.settings import get_settings
from app.data.agents.physics_descriptive_agent import PhysicsDescriptiveAgent
from app.data.dspy.dspy_config import configure_dspy
from app.domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution


def _utcnow() -> datetime:
    return datetime.now(tz=UTC)


async def _run_physics_descriptive(question_text: str) -> PhysicsDescriptiveSolution:
    agent = PhysicsDescriptiveAgent()
    service = PhysicsDescriptiveService(agent)
    return await service.solve_once(PhysicsDescriptiveQuestion(text=question_text))


def run_case(*, agent: str, question: str, offline: bool, print_output: bool) -> int:
    started_at = _utcnow()
    trace_id = str(uuid.uuid4())

    if offline:
        from dspy.utils import DummyLM

        dummy_answer = {
            "reasoning": "Offline mode: no dummy solver available for this question pattern.",
            "value": 0.0,
            "unit": "unit",
        }
        dspy.configure(lm=DummyLM([dummy_answer]), adapter=dspy.ChatAdapter())
        llm_name = "offline/dummy"
    else:
        settings = get_settings()
        configure_dspy(settings)
        llm_name = settings.llm_name

    raw_output: str | None = None
    validated_output: PhysicsDescriptiveSolution | None = None
    run_error: RunError | None = None
    traceback_str: str | None = None

    try:
        if agent != "physics_descriptive":
            raise ValueError(f"Unsupported agent: {agent}")

        validated_output = asyncio.run(_run_physics_descriptive(question))
        raw_output = extract_raw_output()
    except Exception as exc:  # noqa: BLE001 - want artifact even on failure
        raw_output = extract_raw_output()
        run_error = RunError(type=type(exc).__name__, message=str(exc) or repr(exc))
        traceback_str = traceback.format_exc()
    finally:
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
    if print_output and validated_output is not None:
        print(validated_output.model_dump_json(indent=2))
    return 0
