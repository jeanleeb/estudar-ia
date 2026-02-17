from __future__ import annotations

from fastapi import FastAPI

from app.api.routes.physics import router as physics_router
from app.application.services.physics_service import PhysicsService
from app.core.settings import Settings


def create_app(physics_service: PhysicsService, settings: Settings) -> FastAPI:
    app = FastAPI(title="AI Tutor Service", version="0.1.0")
    app.state.physics_service = physics_service
    app.state.settings = settings
    app.include_router(physics_router, prefix="/api/v1")
    return app
