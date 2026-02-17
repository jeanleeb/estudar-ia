from __future__ import annotations

from datetime import UTC, datetime

from app.domain.models.physics import PhysicsQuestion, PhysicsSolution
from app.runner.run_artifact import RunArtifact


def test_run_artifact_serializes_to_json() -> None:
    started_at = datetime(2026, 2, 8, 12, 0, 0, tzinfo=UTC)
    finished_at = datetime(2026, 2, 8, 12, 0, 1, tzinfo=UTC)

    artifact = RunArtifact(
        trace_id="trace-123",
        started_at=started_at,
        finished_at=finished_at,
        duration_ms=1000,
        agent="physics_descriptive",
        llm_name="test-llm",
        input=PhysicsQuestion(text="Q?"),
        raw_output="raw",
        validated_output=PhysicsSolution(reasoning="r", value=1.0, unit="m/s"),
        error=None,
    )

    json_str = artifact.model_dump_json()
    assert '"format_version":"run_artifact.v1"' in json_str
    assert '"trace_id":"trace-123"' in json_str
    assert '"agent":"physics_descriptive"' in json_str
