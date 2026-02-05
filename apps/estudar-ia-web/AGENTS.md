# Instruções para estudar-ia-web

**📑 Navegação Rápida:**
[Regras Críticas](#-regras-críticas-leia-primeiro) • 
[Tipografia](#typography) • 
[Strings/i18n](#internationalization) • 
[Data Fetching](#data-fetching) • 
[Testes](#testes) • 
[Anti-padrões](#anti-padrões-evite) • 
[Exemplos](#exemplos-práticos) • 
[Troubleshooting](#️-troubleshooting---erros-comuns)

---

## 🚨 Regras Críticas (Leia Primeiro!)

Estas são as regras **mais importantes** do projeto. Violá-las causará inconsistências:

### 1. 🔤 Strings de UI
- ✅ **SEMPRE**: `import { translations } from '@/locales'` → `{translations.home.title}`
- ❌ **NUNCA**: Hardcode strings diretamente nos componentes

### 2. 📝 Tipografia
- ✅ **SEMPRE**: `import { H1, Text } from '@/components/ui/typography'` → `<H1>{texto}</H1>`
- ❌ **NUNCA**: Tags HTML diretas (`<h1>`, `<p>`, `<h2>`, etc.)

### 3. 🔄 Data Fetching
- ✅ **SEMPRE**: `useSuspenseQuery` + `<QueryBoundary>`
- ❌ **NUNCA**: `useQuery` sem error/loading boundaries

### 4. 📁 Imports
- ✅ **SEMPRE**: Paths absolutos com `@/` → `import { X } from '@/components/ui/button'`
- ❌ **NUNCA**: Paths relativos → `import { X } from '../../components'`

### Quick Reference - Exemplo Correto Completo

```typescript
// ✅ Todos os padrões corretos aplicados
import { H1, Lead, Small } from '@/components/ui/typography';
import { H1Shimmer } from '@/components/ui/typography.shimmer';
import { Button } from '@/components/ui/button';
import { QueryBoundary } from '@/components/boundaries';
import { translations } from '@/locales';
import { useSuspenseQuery } from '@tanstack/react-query';

export function MyFeature() {
  return (
    <QueryBoundary loadingFallback={<MyFeatureShimmer />}>
      <MyFeatureContent />
    </QueryBoundary>
  );
}

function MyFeatureShimmer() {
  return <H1Shimmer width="3/4" />;
}

function MyFeatureContent() {
  const { data } = useSuspenseQuery({
    queryKey: ['feature'],
    queryFn: fetchFeature,
  });
  
  return (
    <div>
      <H1>{translations.feature.title}</H1>
      <Lead>{translations.feature.description}</Lead>
      <Button>{translations.common.actions.start}</Button>
    </div>
  );
}
```

### 📐 Diagrama: Relação Typography + Strings

```
┌─────────────────────────────────────────────────────────────┐
│                      Seu Componente                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  import { H1, Lead } from '@/components/ui/typography';     │
│  import { translations } from '@/locales';                  │
│                                                              │
│  <H1>{translations.home.hero.title}</H1>                    │
│      │                      │                                │
│      │                      └──────┐                         │
│      │                             │                         │
│      ▼                             ▼                         │
│  ┌──────────────┐         ┌────────────────┐               │
│  │ typography   │         │ pt-BR/         │               │
│  │ .tsx         │         │ home.strings   │               │
│  ├──────────────┤         │ .ts            │               │
│  │ • Estilos    │         ├────────────────┤               │
│  │ • Spacing    │         │ hero: {        │               │
│  │ • Responsive │         │   title: "..." │               │
│  │ • Dark mode  │         │ }              │               │
│  └──────────────┘         └────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Resultado: Texto consistente + traduzível + type-safe
```

**Regra de Ouro**: Componente usa Typography para COMO exibir e Locales para O QUE exibir.

---

## Contexto do Projeto

Este é o frontend web da aplicação EstudarIA, construído com uma stack moderna de React. O projeto faz parte de um monorepo Nx e utiliza TanStack Start (React Router + SSR) como framework principal.

## Stack Tecnológica

### Core
- **React 19** com TypeScript
- **TanStack Start** (React Router v7 com SSR)
- **Vite 7** como build tool
- **Tailwind CSS 4** para estilização
- **React Compiler** (Babel plugin habilitado)

### State Management & Data Fetching
- **TanStack Query** (React Query) para gerenciamento de estado assíncrono
- **Zustand** para estado global simples (ex: theme)
- Sempre use `useSuspenseQuery` em componentes, não `useQuery`

### UI & Componentes
- **Shadcn/ui** (theme: base-vega) com base-ui/react
- **Lucide React** para ícones
- **class-variance-authority (cva)** para reaproveitamento de estilos e composição de classes
- Tailwind variants inline são preferidos

### Testing
- **Vitest** com happy-dom
- **Testing Library** (@testing-library/react, @testing-library/user-event)
- Cobertura mínima configurada para `src/components/**`

### Outros
- **Supabase** para backend/auth
- **@t3-oss/env-core** para validação de variáveis de ambiente
- **Zod** para validação de schemas
- **Biome** para linting/formatting (rodado no workspace root)

## Estrutura de Diretórios

```
src/
├── components/          # Componentes React
│   ├── boundaries/     # Error/Loading/Empty boundaries
│   ├── home/          # Componentes específicos da home
│   ├── shared/        # Componentes compartilhados
│   └── ui/            # Componentes base (shadcn)
├── core/              # Core features (ex: theme)
├── hooks/             # Custom React hooks
├── integrations/      # Integrações externas (TanStack Query, etc)
├── lib/               # Utilitários e helpers
├── locales/           # Internacionalização (pt-BR)
├── routes/            # File-based routing (TanStack Router)
├── server/            # Server-side code (TanStack Start)
├── store/             # Zustand stores
└── test/              # Test utilities e setup
```

## Convenções de Código

### Componentes

1. **Nomenclatura**: Use PascalCase para componentes e arquivos
   ```typescript
   export function MyComponent() { ... }
   // Arquivo: MyComponent.tsx
   ```

2. **Props Interface**: Sempre defina interface para props
   ```typescript
   export interface MyComponentProps {
     /** JSDoc comentário descrevendo a prop */
     title: string;
     optional?: boolean;
   }
   
   export function MyComponent({ title, optional }: MyComponentProps) { ... }
   ```

3. **Estrutura de arquivos**:
   - Componente principal: `component-name.tsx`
   - Testes: `component-name.test.tsx`
   - Shimmer/Loading: `component-name.shimmer.tsx`
   - Mantém componentes relacionados na mesma pasta

4. **Exports**: Use named exports, não default exports (exceto para routes)

### Estilização

1. **Tailwind CSS**: Use classes Tailwind inline
   ```typescript
   <div className="flex items-center gap-2 text-primary">
   ```

2. **Utility cn()**: Sempre use `cn()` do `@/lib/utils` para conditional classes
   ```typescript
   import { cn } from '@/lib/utils';
   
   <div className={cn('base-classes', condition && 'conditional-classes', className)}>
   ```

3. **Reaproveitamento de estilos com cva()**: O projeto utiliza class-variance-authority para reaproveitamento de estilos e composição de classes

4. **Componentes Shadcn**: Instalação via script customizado:
   ```bash
   pnpm ui:add button  # Roda shadcn add + biome format automaticamente
   ```

### Typography

🚨 **REGRA CRÍTICA: Sempre use componentes de tipografia de `@/components/ui/typography`**

1. **NUNCA use tags HTML diretas** para conteúdo textual (`<h1>`, `<h2>`, `<p>`, etc.)

2. **Componentes disponíveis**:
   ```typescript
   import { 
     H1, H2, H3, H4, H5, H6,      // Headings
     Text, Lead, Large, Small,     // Paragraphs
     Muted, Subtle,                // Muted text
     List, ListItem,               // Lists
     Code, Blockquote,             // Code & quotes
     SectionHeader                 // Section headers com icon
   } from '@/components/ui/typography';
   ```

3. **Uso correto**:
   ```typescript
   // ✅ CORRETO - Componentes de tipografia
   import { H1, H3, Lead, Small } from '@/components/ui/typography';
   import { translations } from '@/locales';
   
   <H1>{translations.home.hero.title}</H1>
   <Lead>{translations.home.hero.description}</Lead>
   <H3>{translations.home.features.title}</H3>
   <Small>{translations.common.empty.description}</Small>
   
   // ❌ ERRADO - Tags HTML diretas
   <h1 className="text-4xl font-bold">{title}</h1>
   <p className="text-lg text-muted-foreground">{description}</p>
   <h3 className="text-xl">{subtitle}</h3>
   ```

4. **Componentes principais**:

   **Headings** - Hierarquia semântica automática:
   ```typescript
   <H1>Título Principal</H1>           // Hero titles
   <H2>Título de Seção</H2>            // Section titles
   <H3>Subtítulo</H3>                  // Subsections
   <H4>Título Menor</H4>               // Card titles
   ```
   
   **Text Variants**:
   ```typescript
   <Text>Parágrafo padrão</Text>              // Default paragraph
   <Lead>Parágrafo introdutório</Lead>        // Larger, muted intro text
   <Large>Texto enfatizado</Large>            // Emphasized text
   <Small>Texto secundário</Small>            // Captions, descriptions
   <Muted>Texto discreto</Muted>              // De-emphasized
   <Subtle>Texto muito discreto</Subtle>      // Hints, footnotes
   ```
   
   **Section Headers com ícone**:
   ```typescript
   <SectionHeader
     icon={<BookIcon size="md" />}
     title={translations.home.subjects.title}
     subtitle={translations.home.subjects.subtitle}
   />
   ```

5. **Props comuns**:
   ```typescript
   // Alinhamento
   <H2 align="center">Centralizado</H2>
   
   // Custom className (com cn() para merge)
   <H3 className={cn('custom-class', condition && 'conditional')}>
   
   // Text balance/pretty (para melhor tipografia)
   <Text balance>Texto com balance</Text>
   <Lead pretty>Lead com pretty</Lead>
   ```

6. **Loading States** - Use shimmer components:
   ```typescript
   import { H1Shimmer, H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';
   
   // Durante loading
   <H1Shimmer width="3/4" />
   <H3Shimmer width="1/2" />
   ```

7. **Por que usar componentes?**
   - ✅ Consistência visual automática em toda a aplicação
   - ✅ Espaçamento e hierarquia padronizados
   - ✅ Responsividade (mobile-first) já configurada
   - ✅ Dark mode automático via CSS variables
   - ✅ Mudanças centralizadas (alterar uma vez, atualiza tudo)
   - ✅ Type-safe com props documentadas

8. **Arquitetura do Sistema**:
   
   O arquivo `typography.tsx` é a **fonte única de verdade** para toda tipografia:
   
   ```
   typography.tsx
   ├── Componentes Reais (H1-H6, Text, Lead, etc.)
   │   └── Estilos completos: spacing + visual + responsivo
   │
   ├── Componentes Shimmer (H1Shimmer, TextShimmer, etc.)
   │   └── Extraem spacing/height dos componentes reais
   │
   └── CVA Variants
       ├── headingVariants → estilos visuais dos headings
       ├── headingSpacingVariants → spacing para shimmer
       └── headingHeightVariants → altura para shimmer
   ```
   
   **Benefícios**:
   - Altere `mb-6` em H1 → H1Shimmer atualiza automaticamente
   - Zero duplicação de código
   - Garantia de consistência visual

9. **Exceções (quando NÃO usar componentes de tipografia)**:
   
   Apenas os seguintes casos são aceitáveis:
   - **Componentes de terceiros/Shadcn**: Quando o componente já tem tipografia interna
     ```typescript
     // ✅ OK - Dialog já tem tipografia própria
     <DialogTitle>Título</DialogTitle>
     <DialogDescription>Descrição</DialogDescription>
     ```
   
   - **Elementos semânticos não-visuais**: 
     ```typescript
     // ✅ OK - <label> para formulários (usar componente Label do shadcn)
     <Label htmlFor="email">Email</Label>
     ```
   
   - **Markdown/Rich Text renderizado**: Quando usando biblioteca de markdown
   
   Para **todo o resto**, use os componentes de tipografia!

### Data Fetching

1. **Sempre use TanStack Query** para chamadas de API
2. **Use useSuspenseQuery** para dados que bloqueiam renderização
   ```typescript
   const { data } = useSuspenseQuery({
     queryKey: ['resource', id],
     queryFn: () => fetchResource(id),
   });
   ```

3. **Wrap com QueryBoundary** para loading/error states
   ```typescript
   <QueryBoundary 
     loadingFallback={<LoadingComponent />}
     errorFallbackProps={{ title: 'Custom error' }}
   >
     <ComponentWithSuspenseQuery />
   </QueryBoundary>
   ```

### Routing

1. **File-based routing**: TanStack Router com convenções específicas
   - `routes/index.tsx` → `/`
   - `routes/about.tsx` → `/about`
   - `routes/(auth)/login.tsx` → `/login` (grouped route)

2. **Route structure**:
   ```typescript
   export const Route = createFileRoute('/path')({
     component: Component,
     loader: async ({ context }) => {
       // Prefetch data com TanStack Query
     },
   });
   ```

3. **Navigation**: Use `<Link>` do TanStack Router ou `LinkButton` component
   ```typescript
   import { Link } from '@tanstack/react-router';
   import { LinkButton } from '@/components/ui/link-button';
   ```

### Path Aliases

Configure no `tsconfig.json` e sempre use imports absolutos:
```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSomething } from '@/hooks/useSomething';
import type { SomeType } from '@estuda-ai/domain';
```

**Aliases disponíveis**:
- `@/*` → `apps/estudar-ia-web/src/*`
- `@estuda-ai/domain` → `libs/domain/src/index.ts`

### Environment Variables

1. **Use @t3-oss/env-core** definido em `src/env.ts`
2. **Server vars**: Acesso direto
3. **Client vars**: Prefixo obrigatório `VITE_`
   ```typescript
   import { env } from '@/env';
   
   const apiUrl = env.VITE_API_URL;
   ```

### Testes

1. **Colocação**: Ao lado do arquivo sendo testado
   ```
   component.tsx
   component.test.tsx
   ```

2. **Estrutura**:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { describe, it, expect } from 'vitest';
   import '@/test/mocks'; // Se necessário
   
   describe('Component - MyComponent', () => {
     describe('Feature', () => {
       it('should do something', () => {
         render(<MyComponent />);
         expect(screen.getByText('text')).toBeInTheDocument();
       });
     });
   });
   ```

3. **Query Client**: Use `createTestQueryClient()` helper
   ```typescript
   import { createTestQueryClient } from '@/test/utils';
   import { QueryClientProvider } from '@tanstack/react-query';
   
   const queryClient = createTestQueryClient();
   render(
     <QueryClientProvider client={queryClient}>
       <Component />
     </QueryClientProvider>
   );
   ```

4. **User Interactions**: Use `@testing-library/user-event`
   ```typescript
   import userEvent from '@testing-library/user-event';
   
   const user = userEvent.setup();
   await user.click(button);
   ```

5. **Console.error mocking**: Para testes de error boundaries
   ```typescript
   import { beforeAll, afterAll, vi } from 'vitest';
   
   const originalError = console.error;
   beforeAll(() => { console.error = vi.fn(); });
   afterAll(() => { console.error = originalError; });
   ```

## Padrões Específicos

### Boundaries Pattern

O projeto usa um padrão de "boundaries" para loading/error/empty states:

1. **QueryBoundary**: Combina React ErrorBoundary + Suspense
   ```typescript
   <QueryBoundary
     loadingFallback={<Spinner />}
     errorFallback={<CustomError />}
     errorFallbackProps={{ title: 'Ops!' }}
     onReset={() => console.log('reset')}
   >
     {children}
   </QueryBoundary>
   ```

2. **EmptyCheck**: Para estados vazios
   ```typescript
   <EmptyCheck
     isEmpty={items.length === 0}
     fallback={<EmptyMessage />}
   >
     {children}
   </EmptyCheck>
   ```

### Theme System

1. **Implementação**: Zustand store + CSS variables
2. **Suporta**: light, dark, system
3. **Componente**: `<ThemeToggle />` já implementado
4. **Store**: `src/store/theme.store.ts`

### Internationalization

🚨 **REGRA CRÍTICA: TODAS as strings de UI devem estar centralizadas em arquivos de localização**

1. **Localização**: Arquivos em `src/locales/`
2. **Idioma**: Português (pt-BR)
3. **Por que essa regra existe?**
   - Facilita tradução futura para outros idiomas
   - Centraliza manutenção de textos
   - Permite busca e substituição eficiente
   - Type-safety: TypeScript avisa se string não existe
   
4. **Estrutura de arquivos**:
   ```
   src/locales/
   ├── index.ts                    # Entry point
   ├── README.md                   # Guia de uso
   └── pt-BR/
       ├── index.ts                # Exports all translations
       ├── common.strings.ts       # Strings comuns (nav, actions, errors)
       ├── home.strings.ts         # Strings da home
       └── [page].strings.ts       # Strings específicas por página
   ```

5. **Import e uso correto**:
   ```typescript
   import { translations } from '@/locales';
   
   // ✅ CORRETO - String do arquivo de localização
   <h1>{translations.home.hero.title}</h1>
   <p>{translations.common.error.description}</p>
   
   // ❌ ERRADO - String hardcoded
   <h1>Domine Seus Exames</h1>
   <p>Ocorreu um erro</p>
   ```

6. **Adicionando novas strings**:
   
   **Passo 1**: Adicione no arquivo apropriado
   ```typescript
   // src/locales/pt-BR/common.strings.ts
   export const common = {
     // ... existing
     newSection: {
       title: 'Novo Título',
       description: 'Nova descrição',
     },
   } as const;
   ```
   
   **Passo 2**: Use no componente
   ```typescript
   import { translations } from '@/locales';
   
   function MyComponent() {
     return <h2>{translations.common.newSection.title}</h2>;
   }
   ```

7. **Onde cada tipo de string deve ficar**:
   - `common.strings.ts` - Navegação, botões, labels, erros genéricos, estados vazios
   - `[page].strings.ts` - Conteúdo específico da página (hero, features, descriptions)
   - **NUNCA** hardcode strings nos componentes

8. **Type Safety**: Todas as strings são tipadas com TypeScript
   ```typescript
   // Autocomplete completo disponível
   translations.common.actions.start
   translations.home.hero.title
   ```

## Comandos Nx

Sempre use comandos Nx, não scripts do package.json diretamente:

```bash
# Development
nx serve estudar-ia-web

# Build
nx build estudar-ia-web

# Tests
nx test estudar-ia-web                 # Run once
nx test estudar-ia-web --watch        # Watch mode
nx test estudar-ia-web --coverage     # Com coverage

# Type check
nx run estudar-ia-web:type-check

# Adicionar componente shadcn
cd apps/estudar-ia-web && pnpm ui:add button
```

## Boas Práticas

1. **TypeScript**: Sempre use tipos explícitos, evite `any`
2. **Acessibilidade**: Componentes Shadcn já incluem ARIA attributes
3. **Performance**: 
   - React Compiler está ativado (memoization automática)
   - Use Suspense para code splitting quando apropriado
4. **SSR Ready**: Código deve funcionar no servidor e cliente
5. **Error Handling**: Sempre wrape queries com QueryBoundary
6. **Loading States**: Sempre forneça feedback visual (shimmer components)
7. **Biome**: Linting/formatting automático no monorepo root
   - Não precisa rodar manualmente
   - Use `/** biome-ignore */` quando necessário

## Arquivos Importantes

- `vite.config.ts` - Configuração Vite com plugins TanStack
- `vitest.config.ts` - Configuração de testes
- `components.json` - Configuração Shadcn
- `src/env.ts` - Variáveis de ambiente tipadas
- `src/router.tsx` - Setup do router
- `src/routes/__root.tsx` - Layout raiz com providers
- `src/components/ui/typography.tsx` - **Sistema de tipografia (fonte única de verdade)**
- `src/locales/` - **Todas as strings de UI (centralizadas)**

## Devtools

O projeto inclui devtools para desenvolvimento (habilitadas apenas em dev):

- TanStack Router Devtools
- TanStack Query Devtools  
- TanStack AI Devtools
- React Devtools (extensão browser)

Todos acessíveis pelo painel flutuante no canto inferior direito.

## Anti-padrões (Evite)

❌ Não use `class-variance-authority` (cva)
❌ Não use `useQuery` - use `useSuspenseQuery`
❌ Não importe com paths relativos (`../../`)
❌ Não use default exports (exceto routes)
❌ Não adicione CSS modules ou styled-components
❌ Não rode comandos npm/pnpm diretamente, use Nx
❌ Não ignore TypeScript errors, resolva-os
❌ **NUNCA escreva strings de UI diretamente nos componentes** - use `translations` de `@/locales`
❌ **NUNCA use tags HTML diretas para texto** (`<h1>`, `<h2>`, `<p>`) - use componentes de `@/components/ui/typography`

## Checklist para Novas Features

- [ ] Componente com TypeScript props interface
- [ ] Testes unitários cobrindo casos principais
- [ ] Loading state (shimmer component se necessário)
- [ ] Error handling (QueryBoundary se data fetching)
- [ ] Empty state (EmptyCheck se aplicável)
- [ ] Acessibilidade (ARIA attributes, keyboard navigation)
- [ ] Responsividade (mobile-first Tailwind)
- [ ] Internacionalização (todas as strings de UI em `src/locales/pt-BR/*.strings.ts`)
- [ ] Tipografia (usar componentes H1-H6, Text, Lead, etc. de `@/components/ui/typography`)
- [ ] Type-check passando (`nx run estudar-ia-web:type-check`)
- [ ] Testes passando (`nx test estudar-ia-web`)

## Exemplos Práticos

### ✅ Strings de UI + Tipografia Corretos

```typescript
import { H1, Lead, Small } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { translations } from '@/locales';

export function WelcomeMessage() {
  return (
    <div>
      <H1>{translations.home.hero.title}</H1>
      <Lead>{translations.home.hero.description}</Lead>
      <Button>{translations.common.actions.start}</Button>
    </div>
  );
}
```

### ❌ Múltiplos Erros

```typescript
// NÃO faça isso! Vários problemas:
// 1. Tags HTML diretas ao invés de componentes
// 2. Strings hardcoded ao invés de translations
// 3. Classes de tipografia manuais
export function WelcomeMessage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao EstudarIA</h1>
      <p className="text-lg text-muted-foreground">Comece a estudar agora</p>
      <button>Iniciar</button>
    </div>
  );
}
```

### ✅ Exemplo Completo com Card

```typescript
import { H3, Small } from '@/components/ui/typography';
import { Card } from '@/components/ui/card';
import { translations } from '@/locales';

export function ExamCard({ name, description }: ExamCardProps) {
  return (
    <Card>
      <H3>{name}</H3>
      <Small>{description}</Small>
    </Card>
  );
}
```

### ✅ Section Header com Icon

```typescript
import { SectionHeader } from '@/components/ui/typography';
import { BookOpenIcon } from '@/components/ui/icon';
import { translations } from '@/locales';

export function SubjectsSection() {
  return (
    <SectionHeader
      icon={<BookOpenIcon size="md" className="text-primary" />}
      title={translations.home.subjects.title}
      subtitle={translations.home.subjects.subtitle}
    />
  );
}
```

### ✅ Loading States com Shimmer

```typescript
import { H1Shimmer, H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';
import { Card } from '@/components/ui/card';

export function ExamCardShimmer() {
  return (
    <Card>
      <H3Shimmer width="3/4" />
      <SmallShimmer width="full" />
    </Card>
  );
}

// Shimmer widths disponíveis: '1/4', '1/2', '3/4', 'full'
```

### Exceções para Strings Hardcoded

Apenas os seguintes casos são aceitáveis:
- **IDs técnicos**: `queryKey: ['users', userId]`
- **Class names**: `className="flex items-center"`
- **Paths/URLs**: `/api/users`
- **Tipos TypeScript**: `type Status = 'active' | 'inactive'`
- **Test IDs**: `data-testid="submit-button"`
- **Constantes técnicas**: `const MAX_RETRIES = 3`

Qualquer texto que o usuário verá na interface **DEVE** estar em `src/locales/`.

## ⚠️ Troubleshooting - Erros Comuns

### Erro: "Cannot find module '@/components/ui/typography'"

**Causa**: Import incorreto ou arquivo não existe.

**Solução**:
```typescript
// ✅ Correto
import { H1, Text } from '@/components/ui/typography';

// ❌ Errado
import { H1 } from '@/components/typography';
import H1 from '@/components/ui/typography';
```

### Erro: "Property 'X' does not exist on type 'Translations'"

**Causa**: String não existe no arquivo de localização.

**Solução**:
1. Adicione a string em `src/locales/pt-BR/[file].strings.ts`
2. Verifique se está exportada no `pt-BR/index.ts`
3. Reinicie o TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")

### Warning: "text-4xl", "font-bold" em className

**Causa**: Usando classes de tipografia manualmente ao invés de componentes.

**Solução**:
```typescript
// ❌ Errado
<h1 className="text-4xl font-bold">{title}</h1>

// ✅ Correto
import { H1 } from '@/components/ui/typography';
<H1>{title}</H1>
```

### Erro: Query não reseta após erro

**Causa**: `QueryBoundary` sem `QueryErrorResetBoundary` interno (já incluído).

**Solução**: Certifique-se de usar `QueryBoundary`, não `ErrorBoundary` direto:
```typescript
// ✅ Correto
<QueryBoundary loadingFallback={<Spinner />}>
  <ComponentWithQuery />
</QueryBoundary>
```

### Erro: "Cannot read property of undefined" em translations

**Causa**: Path do translation está incorreto.

**Solução**:
```typescript
// ❌ Errado
translations.home.heroes.title  // "heroes" não existe

// ✅ Correto
translations.home.hero.title    // Confira em pt-BR/home.strings.ts
```

### Componente não atualiza após mudança em locales

**Causa**: HMR não detectou mudança ou cache.

**Solução**:
1. Salve o arquivo de localização novamente
2. Se não funcionar: `nx serve estudar-ia-web` (reinicie o servidor)

### Shimmer não alinha com componente real

**Causa**: Shimmer desatualizado ou usando classes custom.

**Solução**:
```typescript
// ✅ Correto - Shimmer com mesma estrutura
<H1Shimmer width="3/4" />  // Loading
<H1>{translations.title}</H1>  // Loaded

// ❌ Errado - Estruturas diferentes
<div className="h-12 w-full animate-pulse" />  // Custom
<H1>{translations.title}</H1>
```
