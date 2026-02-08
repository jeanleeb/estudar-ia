import pytest
from pydantic import ValidationError

from app.domain.models.physics import PhysicsDescriptiveSolution


def test_should_create_valid_solution():
    """Checks if we can create a solution when all fields are correct."""
    solution = PhysicsDescriptiveSolution(
        reasoning="Velocity is distance divided by time.", value=10.0, unit="m/s"
    )
    assert solution.value == 10.0


def test_should_fail_without_reasoning():
    """Checks if the system blocks a solution that is missing the reasoning."""
    with pytest.raises(ValidationError):
        PhysicsDescriptiveSolution(  # pyright: ignore[reportCallIssue]
            value=50.0, unit="km/h"
        )
