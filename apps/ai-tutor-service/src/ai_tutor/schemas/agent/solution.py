from collections import Counter

from pydantic import Field, PositiveInt, model_validator

from ai_tutor.schemas.common.base import BaseSchema


class SolutionStep(BaseSchema):
    id: PositiveInt
    title: str = Field(min_length=1, max_length=120)
    explanation: str = Field(min_length=1)
    equations: list[str] = Field(default_factory=list)
    depends_on: list[PositiveInt] = Field(default_factory=list)


class AgentSolution(BaseSchema):
    steps: list[SolutionStep] = Field(min_length=1)

    @model_validator(mode="after")
    def check_steps_dependencies(self) -> "AgentSolution":
        step_ids = {step.id for step in self.steps}
        for step in self.steps:
            if step.id in step.depends_on:
                raise ValueError(f"Step {step.id} cannot depend on itself")
            for step_dep in step.depends_on:
                if step_dep not in step_ids:
                    raise ValueError(f"Step {step.id} depends on an unknown step: {step_dep}")
        return self

    @model_validator(mode="after")
    def check_duplicate_step_ids(self) -> "AgentSolution":
        step_ids = [step.id for step in self.steps]
        if len(step_ids) != len(set(step_ids)):
            duplicates = sorted([id for id, count in Counter(step_ids).items() if count > 1])
            raise ValueError(f"Duplicate step ids: {duplicates}")
        return self

    final_answer: str
