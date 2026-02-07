# AGENTS - estudar-ia-web

Este arquivo define regras locais do app `estudar-ia-web`.
Quando houver conflito com o `AGENTS.md` da raiz, este arquivo prevalece para este app.

## Escopo

- App web React/TanStack Start dentro do monorepo Nx.
- Objetivo: manter consistência de UI, i18n e padrões de dados sem inflar contexto do agente.

## Stack e Ferramentas

- Framework: TanStack Start (TanStack Router + SSR) com React.
- UI: Tailwind CSS 4 + componentes em `src/components/ui`.
- Dados assíncronos: TanStack Query.
- Testes: Vitest + Testing Library.
- Package manager oficial do projeto: `pnpm` (evite `npm`/`yarn`).
- Versão de Node: sempre usar a definida em `.nvmrc` com `nvm use` antes de rodar comandos.

## Regras Críticas

### 1) Tipografia (obrigatório)

- Use componentes de `@/components/ui/typography` para texto de interface.
- Evite usar tags HTML de tipografia diretamente (`<h1>`, `<h2>`, `<p>`, etc.) em componentes de UI.
- Para loading textual, use componentes de shimmer de tipografia quando aplicável.
- Exceção: em componentes base de `src/components/ui` (wrappers/base shadcn), tags semânticas nativas são permitidas quando fizerem parte do contrato do componente.
- Em componentes de feature/página (`routes`, `components/shared`, etc.), manter uso de `typography` como padrão.

### 2) Strings de UI / i18n (obrigatório)

- Não hardcode textos visíveis ao usuário.
- Use `translations` de `@/locales`.
- Novas strings devem ser adicionadas em `src/locales/pt-BR/*.strings.ts`.

### 3) Imports

- Prefira imports absolutos com `@/`.
- Evite imports relativos profundos (`../../`).

### 4) Nomenclatura de arquivos

- Convenção do app: arquivos em `kebab-case`.

## Data Fetching

- Use TanStack Query para dados assíncronos.
- `useSuspenseQuery` é recomendado para fluxos bloqueantes com boundary, mas não é obrigatório em todos os casos.
- `useQuery`, `useMutation` e `useSuspenseQuery` são válidos conforme necessidade de UX e arquitetura.
- Quando usar fluxo com Suspense, encapsule com `QueryBoundary`.

## Estilo e Componentes

- Use Tailwind inline e `cn()` de `@/lib/utils` para composição condicional.
- `class-variance-authority (cva)` é permitido e amplamente utilizado no app.
- Componentes base de UI ficam em `src/components/ui`.

## Testes

- Coloque testes próximos ao arquivo testado (`*.test.tsx`).
- Use Vitest + Testing Library.
- Para componentes com query client, usar helpers/utilitários de teste do projeto.

## Comandos

- Sempre rode `nvm use` antes de executar comandos no projeto.
- Use `pnpm` como package manager padrão do workspace.
- Preferir Nx para tarefas principais:
  - `nx serve estudar-ia-web`
  - `nx build estudar-ia-web`
  - `nx test estudar-ia-web`
  - `nx run estudar-ia-web:type-check` (ou target equivalente disponível)
- Scripts de `package.json` podem ser usados quando não houver target Nx adequado (ex.: utilitários locais como `pnpm ui:add button`).

## Referências Úteis

- `src/components/ui/typography.tsx`
- `src/components/ui/typography.shimmer.tsx`
- `src/components/boundaries/query-boundary/query-boundary.tsx`
- `src/locales/index.ts`
- `src/locales/pt-BR/`

## Checklist rápido para mudanças de UI

- Texto veio de `translations`?
- Tipografia usa componentes de `@/components/ui/typography`?
- Imports estão em `@/`?
- Há cobertura mínima de teste para comportamento crítico?
- Comandos de validação relevantes passaram via Nx/script padrão?
