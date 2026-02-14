# estudar-ia-web

Frontend React do projeto estudar-ia.
Stack: React 19, TanStack (Start/Router/Query/AI), Tailwind CSS 4, shadcn/ui, Zustand, Vitest.

## Comandos (sempre via Nx)

```bash
nx serve estudar-ia-web --port 3000  # dev server
nx test estudar-ia-web               # testes
nx run estudar-ia-web:type-check     # tsc
nx run estudar-ia-web:vite:build     # build
```

## Estrutura de pastas

```
src/
├── components/
│   ├── ui/            # Componentes base shadcn/ui (não editar diretamente)
│   ├── shared/        # Componentes reutilizáveis entre features
│   ├── boundaries/    # QueryBoundary, EmptyCheck (wrappers de Suspense/Error)
│   ├── home/          # Componentes da home
│   └── auth/          # Componentes de autenticação
├── core/              # Utilitários core (theme provider)
├── hooks/             # Custom hooks
├── integrations/      # Config de integrações (TanStack Query)
├── lib/               # Utilitários (cn)
├── locales/           # Traduções pt-BR
├── model/             # Modelos de dados (auth, subjects, exams)
├── routes/            # Rotas file-based (TanStack Router)
├── server/
│   ├── data/          # Data sources (Supabase, sessão)
│   └── functions/     # Server functions (RPC)
├── store/             # Zustand stores
└── test/              # Utilitários de teste
```

## Convenções obrigatórias

- **Typography**: Sempre usar componentes de tipografia (`H1`, `H2`, `Small`, `Large`, etc.) para qualquer texto na UI. Nunca usar tags HTML cruas (`<h1>`, `<p>`) para texto.
- **Traduções**: Todo texto visível ao usuário deve vir de `@/locales`. Usar `translations.section.key`, nunca strings hardcoded.
- **Imports**: Sempre absolutos com `@/` (ex: `import { Button } from '@/components/ui/button'`).
- **Nomes de arquivo**: kebab-case (ex: `exam-selection-card.tsx`).

## Componentes

- Compound component pattern para componentes UI compostos (Card, CardHeader, CardFooter).
- Usar `data-slot` para estilização semântica.
- Variantes via `class-variance-authority` (cva).
- Classes condicionais via `cn()` de `@/lib/utils`.
- Para adicionar componentes shadcn: `nx run estudar-ia-web:ui:add -- <component>`.

## Data fetching

- Usar `useSuspenseQuery` para carregamento com Suspense.
- Envolver queries assíncronas com `QueryBoundary` (loading + error handling).
- Server functions via `createServerFn()` de `@tanstack/react-start`.
- Data sources Supabase em `src/server/data/`.
- Mappers separados para transformação de dados (ex: `user.mapper.ts`).

## Estado (Zustand)

- Stores em `src/store/` com interfaces separadas `State` e `Actions`.
- Usar middleware `persist` para estado que sobrevive reload.
- Constantes para chaves de store (ex: `THEME_STORE_KEY`).

## Rotas (TanStack Router)

- File-based routing em `src/routes/`.
- `routeTree.gen.ts` é auto-gerado — não editar.
- Route groups com parênteses: `(auth)/` para rotas de autenticação.
- Preload de dados via `loader` nas rotas.

## Testes

- Vitest + Testing Library.
- Testes colocados junto ao componente: `component.test.tsx` ao lado de `component.tsx`.
- Usar `renderWithQueryClient()` de `@/test/utils` para componentes com queries.
- Usar `createTestQueryClient()` para isolamento (sem retries/cache).
- Testar estados: loading, success, error separadamente.

## Estilo (Tailwind CSS 4)

- Variáveis CSS customizadas em OKLch para cores do tema.
- Suporte light/dark via classe `dark`.
- Tailwind inline — sem CSS-in-JS.
- Animações via `tw-animate-css`.
