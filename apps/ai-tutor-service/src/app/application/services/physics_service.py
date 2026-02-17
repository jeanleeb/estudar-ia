from app.application.ports.physics_port import PhysicsPort
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution


class PhysicsService:
    def __init__(self, solver: PhysicsPort):
        self._solver = solver

    async def solve_once(
        self,
        question: PhysicsQuestion,
    ) -> PhysicsSolution:
        return await self._solver.solve(question)
