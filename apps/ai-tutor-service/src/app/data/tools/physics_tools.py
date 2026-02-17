"""Physics calculation tools for the DSPy ReAct agent.

Each function is a plain Python callable (DSPy requirement) that accepts
and returns strings so the LLM can invoke them directly.  All numeric
work goes through *pint* for unit-aware arithmetic.
"""

from __future__ import annotations

import json
from typing import Literal, TypeAlias

import sympy
from pint import errors as pint_errors

from app.core.unit_registry import UnitQuantity
from app.data.tools.utils import evaluate_expression, parse_formula, parse_variables

ArithmeticOperation: TypeAlias = Literal["add", "subtract", "multiply", "divide", "power"]

# ---------------------------------------------------------------------------
# 1. Basic arithmetic with units
# ---------------------------------------------------------------------------


def calculate(operation: ArithmeticOperation, a: str, b: str) -> str:
    """Perform arithmetic on two physical quantities with automatic unit handling.

    Args:
        operation: One of "add", "subtract", "multiply", "divide", "power".
        a: First quantity as a string, e.g. "5 N" or "3.2" (dimensionless).
        b: Second quantity as a string, e.g. "2 m" or "4".

    Returns:
        The result as a string with its unit, e.g. "10.0 N*m".

    Examples:
        >>> calculate("multiply", "5 N", "2 m")
        '10 meter * newton'
        >>> calculate("divide", "100 km", "2 hr")
        '50.0 kilometer / hour'
        >>> calculate("add", "1 km", "500 m")
        '1500.0 meter'
    """
    try:
        qa = UnitQuantity(a)
        qb = UnitQuantity(b)
    except Exception as exc:
        return f"Error parsing quantities: {exc}"

    ops = {
        "add": lambda: qa + qb,
        "subtract": lambda: qa - qb,
        "multiply": lambda: qa * qb,
        "divide": lambda: qa / qb,
        "power": lambda: qa ** float(qb.magnitude),
    }

    if operation not in ops:
        return f"Error: unknown operation '{operation}'. Use one of: {', '.join(ops)}"

    try:
        result = ops[operation]()
        return str(result)
    except pint_errors.DimensionalityError as exc:
        return f"Error: incompatible units – {exc}"
    except Exception as exc:
        return f"Error: {exc}"


# ---------------------------------------------------------------------------
# 2. Unit conversion
# ---------------------------------------------------------------------------


def convert_unit(quantity: str, target_unit: str) -> str:
    """Convert a physical quantity to a different compatible unit.

    Args:
        quantity: The quantity to convert, e.g. "5 km" or "4e-15 eV*s".
        target_unit: Target unit string compatible with Pint, e.g. "m", "J*s".

    Returns:
        The converted quantity as a string, e.g. "5000.0 m".

    Examples:
        >>> convert_unit("5 km", "m")
        '5000 meter'
        >>> convert_unit("1 hr", "s")
        '3600 second'
    """
    try:
        q = UnitQuantity(quantity)
    except Exception as exc:
        return f"Error parsing quantity: {exc}"

    try:
        converted = q.to(target_unit)
        return str(converted)
    except pint_errors.DimensionalityError as exc:
        return f"Error: incompatible units – {exc}"
    except Exception as exc:
        return f"Error: {exc}"


# ---------------------------------------------------------------------------
# 3. Evaluate a formula (sympy + pint)
# ---------------------------------------------------------------------------


def evaluate_formula(formula: str, variables_json: str) -> str:
    """Evaluate a physics formula by substituting all variables with their values.

    Uses sympy for symbolic parsing and pint for unit-aware computation.

    Args:
        formula: A formula string like "E = h * f" or "v = d / t".
                 The left-hand side is the quantity to compute.
        variables_json: A JSON object mapping variable names to quantity strings,
                        e.g. '{"h": "6.626e-34 J*s", "f": "5e14 Hz"}'.

    Returns:
        The computed result as a string with units.

    Examples:
        >>> evaluate_formula("E = h * f", '{"h": "4e-15 eV*s", "f": "6e14 Hz"}')
        '2400000000000000.0 electron_volt * hertz * second'
        >>> evaluate_formula("F = m * a", '{"m": "10 kg", "a": "9.8 m/s**2"}')
        '98.0 kilogram * meter / second ** 2'
    """
    try:
        variables = parse_variables(variables_json)
        _formula_left_expr, formula_right_expr, _symbols = parse_formula(
            formula=formula, variables=variables
        )
        return evaluate_expression(formula_right_expr, variables)
    except ValueError as exc:
        return str(exc)
    except Exception as exc:
        return f"Error evaluating formula: {exc}"


# ---------------------------------------------------------------------------
# 4. Solve a formula for an unknown variable
# ---------------------------------------------------------------------------


def solve_formula(formula: str, solve_for: str, variables_json: str) -> str:
    """Solve a physics formula for an unknown variable, then substitute known values.

    Args:
        formula: An equation like "F = m * a" or "c = wavelength * f".
        solve_for: The variable to solve for, e.g. "wavelength".
        variables_json: JSON object with known variable values,
                        e.g. '{"c": "3e8 m/s", "f": "6e14 Hz"}'.

    Returns:
        The value of the unknown variable as a string with units.

    Examples:
        >>> solve_formula("c = wavelength * f", "wavelength", '{"c": "3e8 m/s", "f": "6e14 Hz"}')
        '5e-07 meter / hertz / second'
    """
    try:
        variables = parse_variables(variables_json)
        formula_left_expr, formula_right_expr, symbols = parse_formula(
            formula=formula, variables=variables, extra_symbols=[solve_for]
        )
    except ValueError as exc:
        return str(exc)

    equation = sympy.Eq(formula_left_expr, formula_right_expr)
    target_sym = symbols.get(solve_for)
    if target_sym is None:
        return f"Error: variable '{solve_for}' not found in formula."

    try:
        solutions = sympy.solve(equation, target_sym)
    except Exception as exc:
        return f"Error solving equation: {exc}"

    if not solutions:
        return f"Error: could not solve for '{solve_for}'."

    if len(solutions) == 1:
        return evaluate_expression(expression=solutions[0], variables=variables)

    results = [evaluate_expression(expression=s, variables=variables) for s in solutions]
    return json.dumps(results)
