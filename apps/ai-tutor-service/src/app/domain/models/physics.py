from typing import Any

from pydantic import BaseModel, Field


class PhysicsQuestion(BaseModel):
    text: str = Field(min_length=1, description="The text of the physics question")
    reference_data: dict[str, Any] | None = Field(
        default=None, description="Reference data that can be used to solve the problem."
    )


class PhysicsSolution(BaseModel):
    reasoning: str = Field(min_length=1, description="Step-by-step explanation and logic")
    value: float = Field(description="The final numeric value")
    unit: str = Field(
        min_length=1,
        description="Physical unit in English, compatible with Python Pint (e.g., m/s, N, year, meter). Never Portuguese names.",
    )
