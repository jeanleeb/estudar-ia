from functools import lru_cache

from phoenix.otel import register

from app.core.settings import get_settings


@lru_cache(maxsize=1)
def init_observability():
    settings = get_settings()

    tracer_provider = register(
        project_name=settings.otel_project_name,
        auto_instrument=True,
        batch=False,
    )

    return tracer_provider
