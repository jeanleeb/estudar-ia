from typing import Any

import dspy


class PhysicsDescriptiveSignature(dspy.Signature):
    """
    Resolver uma questão dissertativa de física, passo a passo.

    Regras:
    - 'value' deve ser um número puro (sem unidade, sem vírgulas, sem texto).
    - 'unit' deve estar em inglês e compatível com a biblioteca Python Pint
      (e.g., "m/s", "N", "J", "year", "meter", "kg"). Não usar nomes de unidades em português,
      como "ano", "metro".
    - 'reasoning' deve explicar os passos claramente para um aluno.
    """

    question: str = dspy.InputField()
    reference_data: dict[str, Any] | None = dspy.InputField(
        default=None, desc="Dados de referência para a questão, em formato JSON."
    )

    reasoning: str = dspy.OutputField()
    value: float = dspy.OutputField()
    unit: str = dspy.OutputField(
        desc="Unidade de medida, em inglês, compatível com Python Pint (por exemplo, m/s, N, year, meter, Hz). Não usar nomes em português."
    )
