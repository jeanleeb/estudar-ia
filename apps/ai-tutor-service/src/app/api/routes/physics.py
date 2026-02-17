from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_physics_service, verify_api_key
from app.application.services.physics_service import PhysicsService
from app.domain.models.physics import PhysicsQuestion, PhysicsSolution

router = APIRouter(prefix="/physics", tags=["physics"], dependencies=[Depends(verify_api_key)])


@router.post("/solve", response_model=PhysicsSolution)
async def solve_physics(
    question: PhysicsQuestion,
    service: Annotated[PhysicsService, Depends(get_physics_service)],
) -> PhysicsSolution:
    return await service.solve_once(question)
