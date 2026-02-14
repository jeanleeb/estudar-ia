# estudar-ia

Monorepo Nx com duas aplicações e uma biblioteca compartilhada.

## Estrutura do monorepo

- `apps/ai-tutor-service` — Serviço Python (DSPy, Pydantic, uv)
- `apps/estudar-ia-web` — Frontend React (TanStack Start, Tailwind, shadcn/ui)
- `libs/domain` — Tipos e entidades compartilhadas (TypeScript)

Cada app possui seu próprio `CLAUDE.md` com instruções específicas. Ao trabalhar em um app, leia o `CLAUDE.md` local para contexto adicional.

## Ferramentas e package managers

- **Node/TS**: pnpm 10 (lockfile: `pnpm-lock.yaml`)
- **Python**: uv (lockfile: `apps/ai-tutor-service/uv.lock`)
- **Linting TS/JS**: Biome (`npx biome check --fix --unsafe`)
- **Linting Python**: Ruff (`uv run ruff check --fix && uv run ruff format`)
- **Testes**: Vitest (web), pytest (Python)

## Convenções gerais

- Nunca editar arquivos `.env` — contêm credenciais sensíveis.
- Nunca editar lockfiles (`pnpm-lock.yaml`, `uv.lock`) manualmente.
- Imports absolutos em ambos os apps: `@/` (web) e `app.` (Python).
- Preferir editar arquivos existentes a criar novos.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

## Comandos úteis

```bash
# Todos os checks (lint + type-check)
pnpm check

# Testes
pnpm test                    # todos
nx run ai-tutor-service:test # só Python
nx test estudar-ia-web       # só web

# Dev
pnpm dev:web                 # frontend (porta 3000)
pnpm dev:ai                  # serviço Python
```