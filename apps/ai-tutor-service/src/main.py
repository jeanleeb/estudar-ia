from core.settings import get_settings
from data.agents.dspy_config import configure_dspy


def main() -> None:
    configure_dspy(get_settings())
    print("Hello from ai-tutor!")


if __name__ == "__main__":
    main()
