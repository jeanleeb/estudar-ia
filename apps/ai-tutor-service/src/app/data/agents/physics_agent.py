from __future__ import annotations

from typing import Protocol, cast

import dspy

from app.application.ports.physics_port import PhysicsPort
from app.application.signatures.physics_signature import PhysicsSignature
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution


class PhysicsAgent(PhysicsPort):
    def __init__(self) -> None:
        self._predictor = dspy.ChainOfThought(PhysicsSignature)

    async def solve(self, question: PhysicsQuestion) -> PhysicsSolution:
        pred = cast(
            _PhysicsPred,
            await self._predictor.acall(
                question=question.text, reference_data=question.reference_data
            ),
        )

        return PhysicsSolution(
            reasoning=pred.reasoning,
            value=pred.value,
            unit=pred.unit,
        )


class _PhysicsPred(Protocol):
    reasoning: str
    value: float
    unit: str
