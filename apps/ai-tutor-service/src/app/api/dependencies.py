from __future__ import annotations

import hmac
from typing import Annotated

from fastapi import Depends, HTTPException, Request, Security
from fastapi.security import APIKeyHeader

from app.api.state import AppState
from app.application.services.physics_service import PhysicsService

_api_key_header = APIKeyHeader(name="X-API-Key")


def get_app_state(request: Request) -> AppState:
    return request.app.state


def get_physics_service(
    state: Annotated[AppState, Depends(get_app_state)],
) -> PhysicsService:
    return state.physics_service


def verify_api_key(
    state: Annotated[AppState, Depends(get_app_state)],
    api_key: str = Security(_api_key_header),
) -> str:
    expected_key = state.settings.tutor_api_key.get_secret_value()
    if hmac.compare_digest(api_key, expected_key):
        return api_key

    raise HTTPException(status_code=401, detail="Invalid API key")
