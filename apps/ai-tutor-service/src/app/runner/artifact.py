import json
from pathlib import Path

from dspy import settings
from dspy.clients.lm import cast


def extract_raw_output() -> str | None:
    lm = getattr(settings, "lm", None)
    history_obj: object = getattr(lm, "history", None)
    if not isinstance(history_obj, list):
        return None

    history = cast(list[object], history_obj)
    if not history:
        return None
    last: object = history[-1]
    if isinstance(last, str):
        return last

    if isinstance(last, dict):
        last_dict = cast(dict[object, object], last)
        for key in ("response", "completion", "output", "outputs", "text", "answer"):
            candidate = last_dict.get(key)
            if isinstance(candidate, str) and candidate.strip():
                return candidate
            if isinstance(candidate, list):
                candidate_list = cast(list[object], candidate)
                if not candidate_list:
                    continue
                combined = "\n".join([c for c in candidate_list if isinstance(c, str)]).strip()
                if combined:
                    return combined

        try:
            return json.dumps(last_dict, ensure_ascii=False, indent=2, default=str)
        except Exception:
            return str(last_dict)

    return str(last)


def default_artifacts_dir() -> Path:
    # cwd is `apps/ai-tutor-service` when called via Nx target
    return Path(".artifacts") / "runs"
