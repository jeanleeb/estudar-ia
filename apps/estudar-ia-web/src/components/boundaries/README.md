# Boundaries - Async State Management Components

> **Arquitetura moderna para gerenciamento declarativo de estados assíncronos em React**

Esta pasta contém componentes de **boundary** (fronteira) que gerenciam estados de requisições assíncronas usando os recursos nativos do React (Suspense + Error Boundary) combinados com TanStack Query.

## 📁 Estrutura

```
boundaries/
├── query-boundary/
│   ├── index.tsx           # QueryBoundary component
│   └── error-fallback.tsx  # ErrorFallback UI component
├── empty-check/
│   ├── index.tsx           # EmptyCheck component
│   └── empty-fallback.tsx  # EmptyFallback UI component
├── index.tsx               # Barrel exports
├── README.md               # This file
├── MIGRATION.md            # Migration guide from v1 to v2
└── CHANGELOG.md            # Version history
```

## 🎯 Por que esta arquitetura?

### Separação de Responsabilidades

- **`/components/ui`**: Componentes **atômicos** de UI (buttons, inputs, cards, etc.)
- **`/components/boundaries`**: Componentes de **composição e lógica** para gerenciamento de estado

Os componentes de boundaries **não são elementos básicos de UI** - eles orquestram estados, lidam com fluxos de dados e compõem outros componentes. Por isso, merecem sua própria pasta.

### Benefícios

1. **Escalabilidade**: Fácil adicionar novos tipos de boundaries (auth, permissions, etc.)
2. **Manutenibilidade**: Componentes e seus fallbacks estão co-localizados
3. **Reusabilidade**: Componentes de fallback podem ser usados independentemente
4. **Clareza**: A intenção de cada componente é clara pela sua localização

## 🧩 Componentes

### `QueryBoundary`

Orquestra os estados de **loading** e **error** para requisições assíncronas.

**Responsabilidades:**
- Gerenciar Suspense (loading state)
- Gerenciar Error Boundary (error state)
- Integrar com TanStack Query para retry automático
- Prover API consistente e flexível via composição

**Uso básico:**

```tsx
import { QueryBoundary } from '@/components/boundaries';

<QueryBoundary loadingFallback={<Skeleton />}>
  <DataComponent />
</QueryBoundary>
```

**Com customização:**

```tsx
<QueryBoundary
  loadingFallback={<CustomSkeleton />}
  errorFallbackProps={{
    title: 'Erro ao carregar',
    description: 'Não foi possível carregar os dados.',
    retryLabel: 'Tentar novamente',
  }}
>
  <DataComponent />
</QueryBoundary>
```

**Com fallback totalmente customizado:**

```tsx
<QueryBoundary
  loadingFallback={<Skeleton />}
  errorFallback={<MyCustomError />}
>
  <DataComponent />
</QueryBoundary>
```

### `ErrorFallback`

Componente de UI para exibir erros de forma amigável.

**Uso standalone:**

```tsx
import { ErrorFallback } from '@/components/boundaries';

<ErrorFallback
  error={error}
  onReset={() => refetch()}
  title="Erro ao carregar"
  description="Algo deu errado."
/>
```

**Com conteúdo customizado:**

```tsx
<ErrorFallback error={error} onReset={reset}>
  <div>
    <p>Detalhes adicionais aqui</p>
    <Button onClick={customAction}>Ação Customizada</Button>
  </div>
</ErrorFallback>
```

### `EmptyCheck`

Verifica se os dados estão vazios e renderiza o estado apropriado.

**Responsabilidades:**
- Verificar se dados estão vazios
- Renderizar fallback ou children condicionalmente
- Prover API flexível para customização

**Uso básico:**

```tsx
import { EmptyCheck } from '@/components/boundaries';

<EmptyCheck isEmpty={!data?.length}>
  <List items={data} />
</EmptyCheck>
```

**Com customização:**

```tsx
<EmptyCheck
  isEmpty={!items?.length}
  fallbackProps={{
    title: 'Nenhum item encontrado',
    description: 'Adicione seu primeiro item.',
  }}
>
  <ItemList items={items} />
</EmptyCheck>
```

**Com fallback customizado:**

```tsx
<EmptyCheck
  isEmpty={!data?.length}
  fallback={<MyCustomEmptyState />}
>
  <DataDisplay data={data} />
</EmptyCheck>
```

### `EmptyFallback`

Componente de UI para exibir estado vazio.

**Uso standalone:**

```tsx
import { EmptyFallback } from '@/components/boundaries';

<EmptyFallback
  title="Sem resultados"
  description="Tente outra busca."
/>
```

**Com conteúdo customizado:**

```tsx
<EmptyFallback
  title="Nenhum item"
  description="Comece criando um novo item."
>
  <Button onClick={handleCreate}>Criar Item</Button>
</EmptyFallback>
```

## ⚠️ Icon Usage

**IMPORTANT:** All icons used in boundaries components MUST come from the centralized icon system:

```tsx
// ✅ CORRECT
import { AlertCircleIcon, SmileIcon } from '@/components/ui/icon';

// ❌ WRONG - Never import directly from lucide-react
import { AlertCircle, Smile } from 'lucide-react';
```

All boundaries components follow this guideline. For more information, see:
- [Icon Guidelines](../ui/ICON_GUIDELINES.md)
- Run verification: `./scripts/verify-icon-usage.sh`

## 🔄 Padrão Completo

O padrão recomendado combina `QueryBoundary` + `EmptyCheck` + `useSuspenseQuery`:

```tsx
import { QueryBoundary, EmptyCheck } from '@/components/boundaries';
import { useSuspenseQuery } from '@tanstack/react-query';

function MyPage() {
  return (
    <QueryBoundary
      loadingFallback={<Skeleton />}
      errorFallbackProps={{
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar os dados.',
      }}
    >
      <DataFetcher />
    </QueryBoundary>
  );
}

function DataFetcher() {
  const { data } = useSuspenseQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  return (
    <EmptyCheck
      isEmpty={!data?.length}
      fallbackProps={{
        title: 'Nenhum item',
        description: 'Não há itens disponíveis.',
      }}
    >
      <ItemList items={data} />
    </EmptyCheck>
  );
}
```

### 4 Estados Gerenciados

| Estado    | Responsável     | Renderiza               |
|-----------|-----------------|-------------------------|
| Loading   | QueryBoundary   | `loadingFallback`       |
| Error     | QueryBoundary   | `ErrorFallback`         |
| Empty     | EmptyCheck      | `EmptyFallback`         |
| Success   | Component       | Children                |

## 🎨 Princípios de Design

### 1. Composição sobre Configuração

Preferimos usar `children` e componentes compostos ao invés de muitas props:

```tsx
// ✅ Bom: Composição
<ErrorFallback error={error} onReset={reset}>
  <Button>Custom Action</Button>
</ErrorFallback>

// ❌ Evitar: Muitas props
<ErrorFallback
  error={error}
  onReset={reset}
  showDetails={true}
  customButton="Custom Action"
  buttonVariant="primary"
  buttonSize="lg"
/>
```

### 2. API Progressiva

Os componentes funcionam com zero configuração, mas permitem customização incremental:

```tsx
// Nível 1: Zero config (usa defaults)
<EmptyCheck isEmpty={!data?.length}>
  <List />
</EmptyCheck>

// Nível 2: Customização leve (props)
<EmptyCheck
  isEmpty={!data?.length}
  fallbackProps={{ title: 'Custom title' }}
>
  <List />
</EmptyCheck>

// Nível 3: Customização completa (render prop)
<EmptyCheck
  isEmpty={!data?.length}
  fallback={<FullyCustomEmptyState />}
>
  <List />
</EmptyCheck>
```

### 3. Separação de Concerns

Cada componente tem uma responsabilidade única:

- **QueryBoundary**: Orquestra Suspense + Error Boundary
- **ErrorFallback**: UI para erros
- **EmptyCheck**: Lógica condicional para dados vazios
- **EmptyFallback**: UI para estado vazio

### 4. Type Safety

Todos os componentes são totalmente tipados com TypeScript:

```tsx
export interface QueryBoundaryProps {
  children: React.ReactNode;
  loadingFallback: React.ReactNode;
  errorFallback?: React.ReactNode;
  errorFallbackProps?: Partial<Omit<ErrorFallbackProps, 'error' | 'onReset'>>;
  className?: string;
  onReset?: () => void;
}
```

## 🌐 Localização (i18n)

Todos os componentes usam strings localizadas por padrão:

```tsx
import { t } from '@/locales';

// Mensagens padrão em pt-BR
t.common.error.title          // "Algo deu errado"
t.common.error.description    // "Ocorreu um erro ao carregar os dados."
t.common.error.retryButton    // "Tentar novamente"

t.common.empty.title          // "Nenhum item encontrado"
t.common.empty.description    // "Não há itens disponíveis."
```

Para customizar, passe as props apropriadas:

```tsx
<QueryBoundary
  errorFallbackProps={{
    title: t.exams.error.title,
    description: t.exams.error.description,
  }}
>
  ...
</QueryBoundary>
```

## 🧪 Testabilidade

Os componentes são fáceis de testar devido à separação de responsabilidades:

```tsx
// Testar ErrorFallback isoladamente
<ErrorFallback
  error={new Error('Test error')}
  onReset={mockReset}
/>

// Testar EmptyCheck com diferentes estados
<EmptyCheck isEmpty={true}>
  <div>Content</div>
</EmptyCheck>

// Testar QueryBoundary com Mock Query
<QueryClientProvider client={testQueryClient}>
  <QueryBoundary loadingFallback={<div>Loading</div>}>
    <TestComponent />
  </QueryBoundary>
</QueryClientProvider>
```

## 📚 Referências

- [QUERY_BOUNDARY.md](../../../docs/QUERY_BOUNDARY.md) - Guia detalhado em inglês
- [SUSPENSE_GUIDE.pt-BR.md](../../../docs/SUSPENSE_GUIDE.pt-BR.md) - Guia de migração em português
- [QUERY_BOUNDARY_I18N.md](../../../docs/QUERY_BOUNDARY_I18N.md) - Referência de i18n
- [React Suspense](https://react.dev/reference/react/Suspense)
- [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [TanStack Query Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)

## 🚀 Próximos Passos

1. Adicionar mais exemplos na documentação
2. Criar testes unitários para cada componente
3. Adicionar Storybook stories
4. Considerar adicionar `PermissionBoundary` e `AuthBoundary` no futuro
5. Documentar padrões avançados (nested boundaries, etc.)

---

**Mantido por:** Equipe de Desenvolvimento  
**Última atualização:** 2024