from __future__ import annotations

import argparse
import logging

from app.runner.run_case import run_case
from app.runner.run_eval import run_eval


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="ai-tutor-service")
    # Keep an optional "run-case" positional for backwards compatibility, but default to it
    # so `python -m cli --question "..."` works.
    parser.add_argument("command", nargs="?", choices=["run-case", "eval"], default="run-case")
    parser.add_argument("--agent", choices=["physics_descriptive"], default="physics_descriptive")
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Run without network by using a dummy LLM (best-effort for supported question patterns).",
    )
    parser.add_argument("--question", help="Question text")
    parser.add_argument(
        "--print", action="store_true", help="Also print validated output JSON to stdout"
    )
    parser.add_argument(
        "--dataset",
        default="evals/physics/fuvest_descriptive_dev.jsonl",
        help="JSONL dataset path for eval",
    )
    parser.add_argument(
        "--max-cases", type=int, default=None, help="Maximum number of cases to evaluate"
    )

    return parser


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    parser = _build_parser()
    args = parser.parse_args()

    if args.command == "eval":
        raise SystemExit(
            run_eval(
                dataset=args.dataset,
                max_cases=args.max_cases,
                offline=args.offline,
                print_output=args.print,
            )
        )

    if not args.question:
        parser.error("--question is required for run-case")

    if args.command == "run-case":
        raise SystemExit(
            run_case(
                agent=args.agent,
                question=args.question,
                offline=args.offline,
                print_output=args.print,
            )
        )


if __name__ == "__main__":
    main()
