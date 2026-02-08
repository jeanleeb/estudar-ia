from app.application.ports.physics_descriptive_port import PhysicsDescriptivePort
from app.domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution


class PhysicsDescriptiveService:
    def __init__(self, solver: PhysicsDescriptivePort):
        self._solver = solver

    async def solve_once(
        self,
        question: PhysicsDescriptiveQuestion,
    ) -> PhysicsDescriptiveSolution:
        return await self._solver.solve(question)
