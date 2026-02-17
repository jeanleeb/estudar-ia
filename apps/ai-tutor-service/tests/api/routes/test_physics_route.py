import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_solve_physics(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        url="/api/v1/physics/solve",
        headers=auth_headers,
        json={"text": "What is the force of gravity on a 10kg object?"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_solve_physics_with_reference_data(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        url="/api/v1/physics/solve",
        headers=auth_headers,
        json={
            "text": "What is the force of gravity on a 10kg object?",
            "reference_data": {"g": "10 m/s^2"},
        },
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_solve_physics_without_api_key_returns_401(client: AsyncClient):
    response = await client.post(
        url="/api/v1/physics/solve",
        json={"text": "What is the force of gravity on a 10kg object?"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_solve_physics_with_invalid_api_key_returns_401(client: AsyncClient):
    response = await client.post(
        url="/api/v1/physics/solve",
        headers={"X-API-Key": "wrong-key"},
        json={"text": "What is the force of gravity on a 10kg object?"},
    )
    assert response.status_code == 401
