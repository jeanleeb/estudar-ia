from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from app.api.app import create_app
from app.application.services.physics_service import PhysicsService
from app.core.observability import init_observability
from app.core.settings import get_settings
from app.data.agents.physics_agent import PhysicsAgent
from app.data.dspy.dspy_config import configure_dspy

settings = get_settings()
init_observability()
configure_dspy(settings)

physics_service = PhysicsService(solver=PhysicsAgent())

app = create_app(physics_service=physics_service, settings=settings)
FastAPIInstrumentor.instrument_app(app)
