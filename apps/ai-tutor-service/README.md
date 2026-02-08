# ai-tutor-service

## Rodar um caso (Fase 0)

Pré-requisitos:
- `LLM_API_KEY` e (opcional) `LLM_NAME` em `apps/ai-tutor-service/.env` (exceto quando usar `--offline`)

Comando (no root do monorepo):
- Online: `nx run ai-tutor-service:run -- --question="..." --print`
- Offline (sem rede): `nx run ai-tutor-service:run -- --offline --question="..." --print`

O artefato JSON é salvo por padrão em `apps/ai-tutor-service/.artifacts/runs/<YYYY-MM-DD>/<trace_id>.json`.
