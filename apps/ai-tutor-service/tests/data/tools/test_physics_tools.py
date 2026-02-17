from app.data.tools.physics_tools import (
    calculate,
    convert_unit,
    evaluate_formula,
    solve_formula,
)


class TestCalculate:
    def test_multiply_with_units(self):
        result = calculate("multiply", "5 N", "2 m")
        assert "10" in result

    def test_divide_with_units(self):
        result = calculate("divide", "100 km", "2 hr")
        assert "50" in result

    def test_add_same_dimension(self):
        result = calculate("add", "1 km", "500 m")
        assert "1500" in result or "1.5" in result

    def test_subtract(self):
        result = calculate("subtract", "10 m", "3 m")
        assert "7" in result

    def test_power(self):
        result = calculate("power", "3 m", "2")
        assert "9" in result

    def test_add_incompatible_units_returns_error(self):
        result = calculate("add", "5 kg", "3 m")
        assert "error" in result.lower()

    def test_unknown_operation_returns_error(self):
        result = calculate("modulo", "5", "3")  # type: ignore[arg-type]
        assert "error" in result.lower()

    def test_invalid_quantity_returns_error(self):
        result = calculate("add", "not_a_number", "5 m")
        assert "error" in result.lower()


class TestConvertUnit:
    def test_km_to_m(self):
        result = convert_unit("5 km", "m")
        assert "5000" in result

    def test_hr_to_s(self):
        result = convert_unit("1 hr", "s")
        assert "3600" in result

    def test_incompatible_returns_error(self):
        result = convert_unit("5 kg", "meter")
        assert "error" in result.lower()

    def test_invalid_quantity_returns_error(self):
        result = convert_unit("abc", "m")
        assert "error" in result.lower()


class TestEvaluateFormula:
    def test_simple_multiplication(self):
        result = evaluate_formula("E = h * f", '{"h": "4e-15 eV*s", "f": "6e14 Hz"}')
        assert "2.4" in result

    def test_force_equals_mass_times_acceleration(self):
        result = evaluate_formula("F = m * a", '{"m": "10 kg", "a": "9.8 m/s**2"}')
        assert "98" in result

    def test_division_formula(self):
        result = evaluate_formula("v = d / t", '{"d": "100 m", "t": "10 s"}')
        assert "10" in result

    def test_invalid_json_returns_error(self):
        result = evaluate_formula("E = h * f", "not json")
        assert "error" in result.lower()

    def test_invalid_formula_returns_error(self):
        result = evaluate_formula("no equals sign", '{"x": "1 m"}')
        assert "error" in result.lower()


class TestSolveFormula:
    def test_solve_for_wavelength(self):
        result = solve_formula(
            "c = wavelength * f", "wavelength", '{"c": "3e8 m/s", "f": "6e14 Hz"}'
        )
        assert "5" in result

    def test_solve_for_mass(self):
        result = solve_formula("F = m * a", "m", '{"F": "100 N", "a": "10 m/s**2"}')
        assert "10" in result

    def test_quadratic_returns_multiple_solutions_as_json(self):
        # E = 0.5 * m * v**2  →  v = ±sqrt(2E/m)
        result = solve_formula("E = 0.5 * m * v**2", "v", '{"E": "50 J", "m": "1 kg"}')
        import json

        solutions = json.loads(result)
        assert isinstance(solutions, list)
        assert len(solutions) == 2

    def test_variable_not_in_formula_returns_error(self):
        result = solve_formula("F = m * a", "x", '{"m": "10 kg", "a": "5 m/s**2"}')
        assert "error" in result.lower()

    def test_invalid_json_returns_error(self):
        result = solve_formula("F = m * a", "m", "bad json")
        assert "error" in result.lower()
