import pytest

from app.application.services.physics_descriptive_service import PhysicsDescriptiveService
from app.domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution


class FakePhysicsSolver:
    async def solve(self, question: PhysicsDescriptiveQuestion) -> PhysicsDescriptiveSolution:
        return PhysicsDescriptiveSolution(
            reasoning="Fake reasoning",
            value=42,
            unit="N",
        )


@pytest.mark.asyncio
async def test_solve_once_returns_solution():
    service = PhysicsDescriptiveService(solver=FakePhysicsSolver())

    result = await service.solve_once(PhysicsDescriptiveQuestion(text="Enunciado qualquer"))

    assert result.value == 42
    assert result.unit == "N"
