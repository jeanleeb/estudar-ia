from __future__ import annotations

from typing import Protocol, cast

import dspy

from app.application.ports.physics_descriptive_port import PhysicsDescriptivePort
from app.application.signatures.physics_descriptive_signature import PhysicsDescriptiveSignature
from app.domain.models.physics import PhysicsDescriptiveQuestion, PhysicsDescriptiveSolution


class PhysicsDescriptiveAgent(PhysicsDescriptivePort):
    def __init__(self) -> None:
        self._predictor = dspy.ChainOfThought(PhysicsDescriptiveSignature)

    async def solve(self, question: PhysicsDescriptiveQuestion) -> PhysicsDescriptiveSolution:
        pred = cast(_PhysicsPred, await self._predictor.acall(question=question.text))

        return PhysicsDescriptiveSolution(
            reasoning=pred.reasoning,
            value=pred.value,
            unit=pred.unit,
        )


class _PhysicsPred(Protocol):
    reasoning: str
    value: float
    unit: str
