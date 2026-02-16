from enum import StrEnum


class SpanName(StrEnum):
    RUNNER_RUN_CASE = "runner.run_case"
    SERVICE_SOLVE_ONCE = "service.solve_once"
    AGENT_SOLVE = "agent.solve"
    EVAL_RUN = "runner.run_eval"


class AttrKey(StrEnum):
    TRACE_ID = "app.trace_id"
    OFFLINE = "offline"
    DATASET_PATH = "eval.dataset_path"
    EVAL_TOTAL_CASES = "eval.total_cases"
    EVAL_ERROR_CASES = "eval.error_cases"
    ERROR_TYPE = "error.type"
    ERROR_MESSAGE = "error.message"


class SpanKind(StrEnum):
    EVAL = "EVALUATOR"
    CHAIN = "CHAIN"
