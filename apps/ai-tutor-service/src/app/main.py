from app.api.app import create_app
from app.application.services.physics_service import PhysicsService
from app.core.settings import get_settings
from app.data.agents.physics_agent import PhysicsAgent
from app.data.dspy.dspy_config import configure_dspy

settings = get_settings()
configure_dspy(settings)

physics_service = PhysicsService(solver=PhysicsAgent())

app = create_app(physics_service=physics_service)
