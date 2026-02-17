from __future__ import annotations

from app.api.routes.physics import router as physics_router
from app.api.state import AppState, TutorApp
from app.application.services.physics_service import PhysicsService
from app.core.settings import Settings


def create_app(physics_service: PhysicsService, settings: Settings) -> TutorApp:
    app = TutorApp(title="AI Tutor Service", version="0.1.0")
    app.state = AppState(physics_service=physics_service, settings=settings)
    app.include_router(physics_router, prefix="/api/v1")
    return app
