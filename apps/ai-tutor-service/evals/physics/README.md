# Physics Eval Dataset

Este diretório contém datasets JSONL para eval de questões dissertativas de física (Fuvest).

## Formato
- Arquivo: `*.jsonl`
- Regra: 1 objeto JSON por linha

## Taxonomia de Tópicos
Use apenas os tópicos abaixo no campo `topics`.

- `kinematics`: Cinemática
- `dynamics`: Dinâmica
- `work_energy_power`: Trabalho, Energia e Potência
- `impulse_momentum`: Impulso e Quantidade de Movimento
- `gravitation`: Gravitação
- `statics`: Estática
- `electrodynamics`: Eletrodinâmica
- `electrostatics`: Eletrostática
- `electromagnetism`: Eletromagnetismo
- `calorimetry`: Calorimetria
- `thermodynamics`: Termodinâmica
- `waves`: Ondulatória
- `optics`: Óptica
- `modern_physics`: Física Moderna

## Regras de Consistência
- Usar no máximo 2 tópicos por questão.
- Evitar tópicos de método (por exemplo, conversão de unidades) como `topic`.
- Questões de mola:
  - quando foco for força/resultante/centrípeta, priorizar `dynamics`;
  - quando foco for energia armazenada, variação de energia ou potência, priorizar `work_energy_power`.
