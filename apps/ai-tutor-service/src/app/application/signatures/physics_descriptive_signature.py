import dspy


class PhysicsDescriptiveSignature(dspy.Signature):
    """
    Solve a descriptive physics problem step-by-step.

    Rules:
    - 'value' must be a pure number (no unit, no commas, no text).
    - 'unit' must contain only the unit string (e.g., "m/s", "N", "J").
    - 'reasoning' must explain the steps clearly for a student.
    """

    question: str = dspy.InputField()

    reasoning: str = dspy.OutputField()
    value: float = dspy.OutputField()
    unit: str = dspy.OutputField()
