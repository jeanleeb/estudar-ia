import dspy

from app.core.observability import init_observability
from app.core.settings import get_settings
from app.data.dspy.dspy_config import configure_dspy


def setup_llm(offline: bool) -> str:
    init_observability()
    if offline:
        from dspy.utils import DummyLM

        dummy_answer = {
            "reasoning": "Offline mode: no dummy solver available for this question pattern.",
            "value": 0.0,
            "unit": "unit",
        }
        dspy.configure(
            lm=DummyLM({"": dummy_answer}),
        )
        return "offline/dummy"
    else:
        settings = get_settings()
        configure_dspy(settings)
        return settings.llm_name
