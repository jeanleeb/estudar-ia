from __future__ import annotations

from dataclasses import dataclass

from fastapi import FastAPI

from app.application.services.physics_service import PhysicsService
from app.core.settings import Settings


@dataclass
class AppState:
    physics_service: PhysicsService
    settings: Settings


class TutorApp(FastAPI):
    state: AppState
