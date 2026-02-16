from pydantic import BaseModel, Field


class PhysicsDescriptiveQuestion(BaseModel):
    text: str = Field(min_length=1, description="Texto da questão de física")


class PhysicsDescriptiveSolution(BaseModel):
    reasoning: str = Field(
        min_length=1, description="Explicacão e lógica de resolucão passo a passo"
    )
    value: float = Field(description="Valor numérico final")
    unit: str = Field(
        min_length=1,
        description="Unidade de medida, em inglês, compatível com Python Pint (por exemplo, m/s, N, year, meter, Hz). Não usar nomes em português.",
    )
