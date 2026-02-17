from __future__ import annotations

from typing import Protocol

from app.domain.models.physics import PhysicsQuestion, PhysicsSolution


class PhysicsPort(Protocol):
    async def solve(
        self,
        question: PhysicsQuestion,
    ) -> PhysicsSolution: ...
