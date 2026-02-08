<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

## Instruções Operacionais (Projeto)

- Sempre usar a versão do Node definida em `.nvmrc` antes de executar comandos (`nvm use`).
- Para tarefas padrão (build, test, lint, type-check, serve), preferir targets do Nx.
- Neste workspace, ao executar Nx, usar: `env NX_DAEMON=false NX_ISOLATE_PLUGINS=false nx ...`.
- Para targets Nx que executam ferramentas Python/`uv` (ex.: `ai-tutor-service`), usar também `UV_CACHE_DIR=/Users/taqtile/projects/personal/estudar-ia/.uv-cache`.
- Quando não existir target Nx apropriado para a ação, usar scripts do `package.json`.
- Em caso de regras específicas por projeto, seguir o `AGENTS.md` local do app/lib em foco.

## Diretrizes para apps Python no monorepo

- O app Python atual é `ai-tutor-service` e deve ser operado preferencialmente via Nx:
  - `nx run ai-tutor-service:run`
  - `nx run ai-tutor-service:test`
  - `nx run ai-tutor-service:lint`
  - `nx run ai-tutor-service:type-check`
  - `nx run ai-tutor-service:format`
  - `nx run ai-tutor-service:check`
- Sempre executar o código Python **no ambiente virtual do `uv`** (ou seja, via `uv run ...`), evitando `python ...` direto fora do `uv`.
- Quando a ação não tiver target Nx, executar a ferramenta Python local do app (`uv`) em `apps/ai-tutor-service`.
- Evitar `pip install` global e evitar criar fluxo paralelo fora de `uv`.
- Alterações no `ai-tutor-service` devem seguir o `AGENTS.md` local em `apps/ai-tutor-service/AGENTS.md`.
