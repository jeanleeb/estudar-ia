import math

import pytest
from pydantic import ValidationError

from app.domain.models.physics import PhysicsSolution


def test_should_create_valid_solution():
    """Checks if we can create a solution when all fields are correct."""
    solution = PhysicsSolution(
        reasoning="Velocity is distance divided by time.", value=10.0, unit="m/s"
    )
    assert math.isclose(solution.value, 10.0)


def test_should_fail_without_reasoning():
    """Checks if the system blocks a solution that is missing the reasoning."""
    with pytest.raises(ValidationError):
        PhysicsSolution(  # type: ignore[missing-argument]
            value=50.0, unit="km/h"
        )
