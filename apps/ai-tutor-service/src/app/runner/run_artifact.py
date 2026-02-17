from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.domain.models.eval import EvalRunSummary
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution


class RunError(BaseModel):
    type: str = Field(min_length=1)
    message: str = Field(min_length=1)


class RunArtifact(BaseModel):
    format_version: Literal["run_artifact.v1"] = Field(default="run_artifact.v1")

    trace_id: str = Field(min_length=1)
    started_at: datetime
    finished_at: datetime
    duration_ms: int = Field(ge=0)

    agent: str = Field(min_length=1)
    llm_name: str | None = None

    input: PhysicsQuestion
    raw_output: str | None = None
    validated_output: PhysicsSolution | None = None
    error: RunError | None = None


class EvalRunArtifact(BaseModel):
    format_version: Literal["eval_run_artifact.v1"] = Field(default="eval_run_artifact.v1")

    trace_id: str = Field(min_length=1)
    started_at: datetime
    finished_at: datetime
    duration_ms: int = Field(ge=0)

    llm_name: str | None = None

    dataset_path: str = Field(min_length=1)
    run_summary: EvalRunSummary
