# AGENTS - ai-tutor-service

Este arquivo define regras locais do app `ai-tutor-service`.
Quando houver conflito com o `AGENTS.md` da raiz, este arquivo prevalece para este app.

## Escopo

- App Python no monorepo Nx responsável pelo sistema de agentes do projeto.
- Stack principal: DSPy + Pydantic + Pytest + Ruff + Ty + `uv`.

## Objetivo das regras

- Manter consistência de arquitetura (domain/application/data/core).
- Garantir que agentes DSPy sejam testáveis, previsíveis e fáceis de evoluir.
- Padronizar execução por Nx sem perder produtividade local com `uv`.

## Fluxo de comandos (ordem de preferência)

1. Use targets Nx do projeto:
   - `nx run ai-tutor-service:run`
   - `nx run ai-tutor-service:test`
   - `nx run ai-tutor-service:lint`
   - `nx run ai-tutor-service:type-check`
   - `nx run ai-tutor-service:format`
   - `nx run ai-tutor-service:check`
2. Sempre executar este app **no ambiente virtual do `uv`** (via `uv run ...`), evitando `python ...` direto fora do `uv`.
3. Quando não houver target Nx para a tarefa, use `uv` no diretório `apps/ai-tutor-service`.
4. Não usar `pip` global para fluxo de desenvolvimento do app.

## Convenções de arquitetura

- `src/domain`: modelos e regras de domínio (sem dependência de infra).
- `src/application`: portas, assinaturas e serviços de orquestração.
- `src/data`: implementações concretas (agentes DSPy, integrações externas).
- `src/core`: configuração, settings e bootstrap.

## Regras para agentes DSPy

- Assinaturas DSPy ficam em `src/application/signatures`.
- Agentes concretos ficam em `src/data/agents` e implementam portas de `src/application/ports`.
- DSPy é um pilar do app para desenho, implementação e evolução de agentes.
- Para qualquer sugestão ou implementação de agentes neste app, priorizar padrões alinhados a DSPy (assinaturas, métricas/eval e otimização orientada a dados).
- Configuração global do DSPy deve ficar centralizada em `src/app/data/dspy/dspy_config.py`.
- Evitar reconfigurar `dspy.configure(...)` em múltiplos pontos.
- Saída estruturada do modelo deve ser validada por modelos de domínio (Pydantic) antes de retornar ao app.

## Diretriz de Datasets para Eval

- Antes de propor criação manual de datasets de avaliação, sempre buscar bases estruturadas existentes (por exemplo, BLUEX: `https://github.com/Portuguese-Benchmark-Datasets/BLUEX`).
- Construção manual deve ser reservada para complementar campos faltantes do schema de eval (como tolerâncias, rubricas de reasoning e metadados específicos do projeto).

## Tipagem, lint e testes

- Manter tipagem estrita compatível com `ty` (executado via `uv run ty check`).
- Evitar `Any`; preferir `Protocol`, `TypedDict` ou modelos Pydantic quando necessário.
- Manter lint/format com Ruff (`ruff check` e `ruff format` via Nx).
- Testes devem ficar em `tests/` com foco em:
  - domínio puro (modelos e validações);
  - serviços de aplicação com doubles/fakes;
  - sem chamada real de LLM em testes unitários.

## Convenções de código e estrutura

- Nomes de arquivos Python em `snake_case`.
- Imports absolutos a partir de `src` (conforme `pytest.ini`).
- Não versionar artefatos locais e cache (`.venv`, `.pytest_cache`, `.ruff_cache`, `.mypy_cache`, `__pycache__`).

## Ambiente e segredos

- Configurações em `src/core/settings.py` usando `pydantic-settings`.
- Segredos e chaves devem vir de variáveis de ambiente (`.env` local), nunca hardcoded.
- Antes de validar integração com LLM, garantir `LLM_API_KEY` e `LLM_NAME` configurados.

## Checklist rápido antes de finalizar

- Mudança respeita camadas (`domain`/`application`/`data`/`core`)?
- Há tipagem adequada sem relaxar regras do `ty`?
- Testes relevantes foram adicionados/atualizados?
- Comandos de validação via Nx passaram para o app?
