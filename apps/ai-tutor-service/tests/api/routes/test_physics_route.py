import asyncio

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.app import create_app
from app.application.services.physics_service import PhysicsService
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution


class FakePhysicsSolver:
    async def solve(self, question: PhysicsQuestion) -> PhysicsSolution:
        return await asyncio.to_thread(
            PhysicsSolution, reasoning="Fake reasoning", value=42.0, unit="N"
        )


@pytest.fixture
def client():
    service = PhysicsService(solver=FakePhysicsSolver())
    app = create_app(physics_service=service)
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_solve_physics(client: AsyncClient):
    response = await client.post(
        url="/api/v1/physics/solve",
        json={
            "text": "What is the force of gravity on a 10kg object?",
        },
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_solve_physics_with_reference_data(client: AsyncClient):
    response = await client.post(
        url="/api/v1/physics/solve",
        json={
            "text": "What is the force of gravity on a 10kg object?",
            "reference_data": {"g": "10 m/s^2"},
        },
    )
    assert response.status_code == 200
