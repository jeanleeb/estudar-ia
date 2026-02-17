from __future__ import annotations

import hmac

from fastapi import HTTPException, Request, Security
from fastapi.security import APIKeyHeader

from app.application.services.physics_service import PhysicsService

_api_key_header = APIKeyHeader(name="X-API-Key")


def get_physics_service(request: Request) -> PhysicsService:
    return request.app.state.physics_service


def verify_api_key(
    request: Request,
    api_key: str = Security(_api_key_header),
) -> str:
    expected_key = request.app.state.settings.tutor_api_key.get_secret_value()
    if hmac.compare_digest(api_key, expected_key):
        return api_key

    raise HTTPException(status_code=401, detail="Invalid API key")
