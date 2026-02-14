# ai-tutor-service

App Python no monorepo Nx responsável pelo sistema de agentes de tutoria.
Stack: DSPy + Pydantic + pytest + Ruff + ty + uv.

## Comandos (sempre via Nx)

```bash
nx run ai-tutor-service:run         # executar
nx run ai-tutor-service:test        # testes
nx run ai-tutor-service:lint        # ruff check
nx run ai-tutor-service:format      # ruff format
nx run ai-tutor-service:type-check  # ty check
nx run ai-tutor-service:check       # lint + type-check
```

Quando não houver target Nx, use `uv run ...` no diretório do app. Nunca use `pip` ou `python` diretamente.

## Arquitetura de camadas

```
src/app/
├── domain/       # Modelos e regras de domínio (sem dependência de infra)
├── application/  # Portas, assinaturas DSPy e serviços de orquestração
├── data/         # Implementações concretas (agentes DSPy, integrações)
└── core/         # Configuração, settings e bootstrap
```

Respeitar a separação de camadas: `domain` não importa de `data`; `application` define interfaces que `data` implementa.

## Agentes DSPy

- Assinaturas DSPy em `src/app/application/signatures/`.
- Agentes concretos em `src/app/data/agents/`, implementando portas de `src/app/application/ports/`.
- Configuração global do DSPy centralizada em `src/app/data/dspy/dspy_config.py` — não reconfigurar `dspy.configure()` em múltiplos pontos.
- Saída estruturada do modelo validada por modelos Pydantic antes de retornar ao app.
- Para qualquer implementação de agentes, priorizar padrões DSPy (assinaturas, métricas/eval, otimização orientada a dados).

## Evals

- Datasets em `evals/` no formato `.jsonl`.
- Antes de criar datasets manualmente, buscar bases estruturadas existentes (ex: BLUEX).
- Construção manual reservada para complementar campos faltantes do schema de eval.

## Tipagem e código

- Tipagem estrita com `ty` — evitar `Any`, preferir `Protocol`, `TypedDict` ou Pydantic.
- Nomes de arquivos em `snake_case`.
- Imports absolutos a partir de `app` (conforme `pytest.ini`).
- Configurações via `pydantic-settings` em `src/app/core/settings.py`.
- Segredos via variáveis de ambiente (`.env`), nunca hardcoded.

## Testes

- Testes em `tests/` espelhando a estrutura de `src/app/`.
- Foco: domínio puro, serviços com doubles/fakes.
- Sem chamada real de LLM em testes unitários.

## Checklist antes de finalizar

- Mudança respeita camadas (`domain`/`application`/`data`/`core`)?
- Tipagem adequada sem relaxar regras do `ty`?
- Testes relevantes adicionados/atualizados?
- `nx run ai-tutor-service:check` passa?
