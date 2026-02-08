from __future__ import annotations

import argparse

from app.cli.run_case import run_case


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="ai-tutor-service")
    # Keep an optional "run-case" positional for backwards compatibility, but default to it
    # so `python -m cli --question "..."` works.
    parser.add_argument("command", nargs="?", choices=["run-case"], default="run-case")
    parser.add_argument("--agent", choices=["physics_descriptive"], default="physics_descriptive")
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Run without network by using a dummy LLM (best-effort for supported question patterns).",
    )
    parser.add_argument("--question", required=True, help="Question text")
    parser.add_argument(
        "--print", action="store_true", help="Also print validated output JSON to stdout"
    )

    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    raise SystemExit(
        run_case(
            agent=args.agent, question=args.question, offline=args.offline, print_output=args.print
        )
    )


if __name__ == "__main__":
    main()
