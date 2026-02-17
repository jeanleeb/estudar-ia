from typing import Any

import dspy


class PhysicsSignature(dspy.Signature):
    """
    Resolver uma questão de física, passo a passo.

    Você tem acesso a ferramentas de cálculo que realizam operações matemáticas
    com precisão e tratam unidades de medida automaticamente. Use essas
    ferramentas para todos os cálculos numéricos em vez de calcular mentalmente.

    Regras:
    - Use as ferramentas disponíveis para todos os cálculos numéricos.
    - 'value' deve ser um número puro (sem unidade, sem vírgulas, sem texto).
    - 'unit' deve estar em inglês e compatível com a biblioteca Python Pint
      (e.g., "m/s", "N", "J", "year", "meter", "kg"). Não usar nomes em português.
    - Escolha a unidade mais apropriada ao contexto da questão (se o enunciado
      menciona km, retorne em km; se menciona nm, retorne em nm).
    - 'reasoning' deve ser uma explicação didática, clara e passo a passo,
      como um professor explicaria para um aluno. Não liste chamadas de
      ferramentas — sintetize os resultados num texto educativo.
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
