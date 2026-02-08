import dspy

from app.core.settings import Settings

_configured = False


def configure_dspy(settings: Settings) -> None:
    global _configured
    if _configured:
        return

    lm = dspy.LM(settings.llm_name, api_key=settings.llm_api_key.get_secret_value())

    dspy.configure(lm=lm, adapter=dspy.JSONAdapter())
    _configured = True
