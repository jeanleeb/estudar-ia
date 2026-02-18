# ai-tutor-service

## Rodar um caso (Fase 0)

Pré-requisitos:
- `LLM_API_KEY` e (opcional) `LLM_NAME` em `apps/ai-tutor-service/.env` (exceto quando usar `--offline`)

Comando (no root do monorepo):
- Online: `nx run ai-tutor-service:run -- --question="..." --print`
- Offline (sem rede): `nx run ai-tutor-service:run -- --offline --question="..." --print`

O artefato JSON é salvo por padrão em `apps/ai-tutor-service/.artifacts/runs/<YYYY-MM-DD>/<trace_id>.json`.

## Rodar a eval

Pré-requisitos:
- `LLM_API_KEY` configurado em `.env`
- [Ollama](https://ollama.com) rodando localmente com o modelo judge instalado (ver seção abaixo)

```bash
# Instalar o modelo judge (exemplo)
ollama pull qwen2.5:7b

# Rodar a eval completa
nx run ai-tutor-service:eval

# Limitar casos (útil para testes rápidos)
nx run ai-tutor-service:eval -- --max-cases=5 --print
```

O artefato JSON é salvo em `apps/ai-tutor-service/.artifacts/evals/<trace_id>.json`.

## LLM Judge

A eval usa um LLM local via Ollama para avaliar a qualidade do reasoning de cada caso. O judge verifica 3 critérios binários e retorna um score de 0.0 a 1.0.

O `total_score` de cada caso é calculado como:
```
total_score = 0.4 * result_ok + 0.6 * reasoning_score
```

Se o Ollama não estiver disponível, o caso é descartado (registrado como erro).

### Escolha do modelo

O modelo ideal depende do hardware disponível. Consulte o [Ollama model library](https://ollama.com/library) para ver opções atualizadas, e o [Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) para comparar qualidade.

| Modelo | VRAM (Q4) | Hardware recomendado |
|---|---|---|
| `gemma3:4b` | ~3 GB | MacBook M1 16 GB, qualquer GPU ≥ 4 GB |
| `qwen2.5:7b` | ~5 GB | GPU ≥ 8 GB; melhor aderência a JSON estruturado |
| `gemma3:12b` | ~8 GB | GPU ≥ 12 GB |
| `qwen2.5:14b` | ~10 GB | GPU ≥ 14 GB |

> **AMD RDNA4 (RX 9000 series):** usar Ollama com backend Vulkan (`OLLAMA_VULKAN=1`), pois o suporte ROCm ainda é instável nessa arquitetura. O Vulkan supera ROCm em benchmarks de inferência no RDNA4.

Configure o modelo via variável de ambiente:

```bash
OLLAMA_JUDGE_MODEL=qwen2.5:7b nx run ai-tutor-service:eval
```

Ou defina `OLLAMA_JUDGE_MODEL` no `.env`.
