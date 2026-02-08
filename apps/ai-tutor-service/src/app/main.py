from app.core.settings import get_settings
from app.data.dspy.dspy_config import configure_dspy


def main() -> None:
    configure_dspy(get_settings())
    print("Hello from ai-tutor!")


if __name__ == "__main__":
    main()
