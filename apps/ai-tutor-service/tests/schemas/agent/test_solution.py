import pytest
from pydantic import ValidationError

from ai_tutor.schemas.agent.solution import AgentSolution


def test_agent_solution_rejects_unknown_dependency():
    data = {
        "steps": [
            {"id": 1, "title": "A", "explanation": "x", "depends_on": []},
            {"id": 2, "title": "B", "explanation": "y", "depends_on": [1]},
            {"id": 3, "title": "C", "explanation": "z", "depends_on": [7]},
        ],
        "final_answer": "done",
    }

    with pytest.raises(ValidationError) as exc:
        AgentSolution.model_validate(data)

    errors = exc.value.errors()
    assert len(errors) == 1
    assert "Step 3 depends on an unknown step: 7" in errors[0]["msg"]


def test_agent_solution_rejects_self_dependency():
    data = {
        "steps": [
            {"id": 1, "title": "A", "explanation": "x", "depends_on": [1]},
        ],
        "final_answer": "done",
    }

    with pytest.raises(ValidationError) as exc:
        AgentSolution.model_validate(data)

    errors = exc.value.errors()
    assert len(errors) == 1
    assert "Step 1 cannot depend on itself" in errors[0]["msg"]


def test_agent_solution_rejects_duplicate_step_ids():
    data = {
        "steps": [
            {"id": 1, "title": "A", "explanation": "x", "depends_on": []},
            {"id": 3, "title": "A", "explanation": "x", "depends_on": [2]},
            {"id": 3, "title": "A", "explanation": "x", "depends_on": [1]},
            {"id": 2, "title": "A", "explanation": "x", "depends_on": [1]},
            {"id": 2, "title": "A", "explanation": "x", "depends_on": []},
        ],
        "final_answer": "done",
    }

    with pytest.raises(ValidationError) as exc:
        AgentSolution.model_validate(data)

    errors = exc.value.errors()
    assert len(errors) == 1
    assert "Duplicate step ids: [2, 3]" in errors[0]["msg"]


def test_agent_solution_accepts_valid_dependencies():
    data = {
        "steps": [
            {"id": 1, "title": "A", "explanation": "x", "depends_on": []},
            {"id": 2, "title": "B", "explanation": "y", "depends_on": [1]},
            {"id": 3, "title": "C", "explanation": "z", "depends_on": [2]},
        ],
        "final_answer": "done",
    }

    solution = AgentSolution.model_validate(data)

    assert solution.final_answer == "done"
    assert [s.id for s in solution.steps] == [1, 2, 3]
