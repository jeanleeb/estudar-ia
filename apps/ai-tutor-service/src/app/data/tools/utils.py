import json

import sympy

from app.core.unit_registry import UnitQuantity


def parse_variables(variables_json: str) -> dict[str, str]:
    try:
        variables = json.loads(variables_json)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Error parsing variables JSON: {exc}") from exc
    if not isinstance(variables, dict):
        raise ValueError(f"Error: expected a JSON object, got {type(variables).__name__}")
    return variables


def evaluate_expression(expression: sympy.Expr, variables: dict[str, str]) -> str:
    """Evaluate a sympy expression by substituting pint quantities."""
    expr_symbols = {str(s) for s in expression.free_symbols}
    missing = expr_symbols - set(variables.keys())
    if missing:
        raise ValueError(f"Missing variables for expression: {missing}")
    func = sympy.lambdify(list(variables.keys()), expression)
    pint_values = {k: UnitQuantity(v) for k, v in variables.items()}
    return str(func(**pint_values))


def parse_formula(
    formula: str, variables: dict[str, str], extra_symbols: list[str] | None = None
) -> tuple[sympy.Expr, sympy.Expr, dict[str, sympy.Symbol]]:
    try:
        formula_left_str, formula_right_str = formula.split("=", maxsplit=1)
    except ValueError:
        raise ValueError(
            "Error parsing formula: formula must contain exactly one '=' sign."
        ) from None

    formula_left_str = formula_left_str.strip()
    formula_right_str = formula_right_str.strip()

    all_names = {formula_left_str} | set(variables.keys())
    if extra_symbols:
        all_names.update(extra_symbols)

    symbols = {name: sympy.Symbol(name) for name in all_names}
    try:
        left_expression = sympy.sympify(formula_left_str, locals=symbols)  # type: ignore[no-matching-overload]  # sympy stubs lack `locals` param
        right_expression = sympy.sympify(formula_right_str, locals=symbols)  # type: ignore[no-matching-overload]
    except (sympy.SympifyError, SyntaxError) as exc:
        raise ValueError(f"Error parsing formula: {exc}") from exc

    return left_expression, right_expression, symbols
