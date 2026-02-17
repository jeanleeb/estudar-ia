from __future__ import annotations

from fastapi import Request

from app.application.services.physics_service import PhysicsService


def get_physics_service(request: Request) -> PhysicsService:
    return request.app.state.physics_service
