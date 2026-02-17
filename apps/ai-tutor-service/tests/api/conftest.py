import asyncio

import pytest
from httpx import ASGITransport, AsyncClient
from pydantic import SecretStr

from app.api.app import create_app
from app.application.services.physics_service import PhysicsService
from app.core.settings import Settings
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution

TEST_API_KEY = "test-secret-key"


@pytest.fixture
def auth_headers():
    return {"X-API-Key": TEST_API_KEY}


class FakePhysicsSolver:
    async def solve(self, question: PhysicsQuestion) -> PhysicsSolution:
        return await asyncio.to_thread(
            PhysicsSolution, reasoning="Fake reasoning", value=42.0, unit="N"
        )


physics_service = PhysicsService(solver=FakePhysicsSolver())


@pytest.fixture
def fake_settings():
    return Settings(
        LLM_API_KEY=SecretStr("fake"),
        PHOENIX_COLLECTOR_ENDPOINT="http://localhost:6006",
        TUTOR_API_KEY=SecretStr(TEST_API_KEY),
    )


@pytest.fixture
def client(fake_settings: Settings):
    app = create_app(physics_service=physics_service, settings=fake_settings)
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")
