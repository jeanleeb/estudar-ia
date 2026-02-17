import asyncio

import pytest

from app.application.services.physics_service import PhysicsService
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution


class FakePhysicsSolver:
    async def solve(self, question: PhysicsQuestion) -> PhysicsSolution:
        return await asyncio.to_thread(
            PhysicsSolution,
            reasoning="Fake reasoning",
            value=42,
            unit="N",
        )


@pytest.mark.asyncio
async def test_solve_once_returns_solution():
    service = PhysicsService(solver=FakePhysicsSolver())

    result = await service.solve_once(PhysicsQuestion(text="Enunciado qualquer"))

    assert result.value == 42
    assert result.unit == "N"
