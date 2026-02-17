from app.core.settings import get_settings
from app.data.dspy.dspy_config import configure_dspy, configure_dspy_offline


def setup_llm(offline: bool) -> str:
    if offline:
        configure_dspy_offline()
        return "offline/dummy"

    settings = get_settings()
    configure_dspy(settings)
    return settings.llm_name
