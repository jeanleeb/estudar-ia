import dspy
from dspy.utils import DummyLM

from app.core.settings import Settings

_configured = False


def configure_dspy(settings: Settings) -> None:
    global _configured
    if _configured:
        return

    lm = dspy.LM(
        settings.llm_name,
        api_key=settings.llm_api_key.get_secret_value(),
        api_base=settings.llm_api_base,
        num_retries=1,
    )

    dspy.configure(lm=lm, adapter=dspy.JSONAdapter())
    _configured = True


def configure_dspy_offline() -> None:
    global _configured
    if _configured:
        return

    dummy_answer = {
        "reasoning": "Offline mode: no dummy solver available for this question pattern.",
        "value": 0.0,
        "unit": "unit",
    }
    dspy.configure(lm=DummyLM({"": dummy_answer}), adapter=dspy.JSONAdapter())
    _configured = True
