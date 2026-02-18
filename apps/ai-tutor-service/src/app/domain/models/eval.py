from typing import Any, Literal

from pydantic import BaseModel, Field


class EvalCaseSource(BaseModel):
    exam: str
    year: int = Field(ge=1977)
    phase: int = Field(ge=1)
    question: str


class EvalExpected(BaseModel):
    value: float
    unit: str


class EvalTolerance(BaseModel):
    abs: float = Field(ge=0.0)
    rel: float = Field(ge=0.0)


class EvalCase(BaseModel):
    id: str
    source: EvalCaseSource
    subject: str
    topics: list[str] = Field(min_length=1)
    difficulty: Literal["easy", "medium", "hard"]
    split: Literal["dev", "test", "train"]
    question_text: str
    expected: EvalExpected
    tolerance: EvalTolerance
    reasoning_rubric: list[str] = Field(min_length=1)
    reference_data: dict[str, Any] | None = None


class EvalCaseScore(BaseModel):
    expected: str | None = None
    predicted: str | None = None
    reasoning: str | None = None
    result_ok: bool
    reasoning_score: float
    total_score: float
    passed: bool
    error: str | None = None


class EvalRunSummary(BaseModel):
    case_results: list[EvalCaseScore]
    total_cases: int
    evaluated_cases: int
    passed_cases: int
    pass_rate: float
    avg_total_score: float
    avg_reasoning_score: float
    avg_value_score: float
