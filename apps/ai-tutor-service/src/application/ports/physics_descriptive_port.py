from __future__ import annotations

from typing import Protocol

from domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution


class PhysicsDescriptivePort(Protocol):
    async def solve(
        self,
        question: PhysicsDescriptiveQuestion,
    ) -> PhysicsDescriptiveSolution: ...
