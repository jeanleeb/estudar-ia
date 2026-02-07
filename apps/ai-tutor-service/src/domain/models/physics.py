from pydantic import BaseModel, Field


class PhysicsDescriptiveQuestion(BaseModel):
    text: str = Field(min_length=1, description="The text of the physics question")


class PhysicsDescriptiveSolution(BaseModel):
    reasoning: str = Field(min_length=1, description="Step-by-step explanation and logic")
    value: float = Field(description="The final numeric value")
    unit: str = Field(min_length=1, description="The physical unit (e.g., m/s, kg)")
