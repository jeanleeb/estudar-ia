# Typography Components

Sistema de componentes de tipografia reutilizáveis para manter consistência visual em toda a aplicação.

## Componentes Disponíveis

### Headings (Títulos)

#### Componentes Específicos: `<H1>` até `<H6>`

Atalhos convenientes para cada nível de título.

```tsx
import { H1, H2, H3, H4, H5, H6 } from '@/components/ui/typography';

<H1>Título Hero (4xl/6xl, bold)</H1>
<H2>Título de Seção (2xl/3xl, semibold)</H2>
<H3>Subtítulo (lg/xl, semibold)</H3>
<H4>Título de Card (base/lg, semibold)</H4>
<H5>Título Pequeno (sm/base, semibold)</H5>
<H6>Título Mínimo (xs/sm, semibold)</H6>
```

**Props:**
- `align?: 'left' | 'center' | 'right'` - Alinhamento do texto
- `className?: string` - Classes CSS adicionais
- Todas as props padrão de elementos HTML de heading

### Text / Paragraph (Texto)

#### Componente Genérico: `<Text>`

Componente flexível para renderizar diferentes tipos de texto.

```tsx
import { Text } from '@/components/ui/typography';

// Texto padrão
<Text>Parágrafo normal</Text>

// Texto como span
<Text as="span">Texto inline</Text>

// Com utilitários de texto
<Text balance>Texto com text-balance</Text>
<Text pretty>Texto com text-pretty</Text>
<Text variant="lead" pretty>Lead paragraph com text-pretty</Text>

// Com alinhamento
<Text align="center">Texto centralizado</Text>
```

#### Componentes Específicos

```tsx
import { Lead, Large, Small, Muted, Subtle } from '@/components/ui/typography';

// Lead - Texto introdutório destacado
<Lead>
  Texto de introdução com destaque visual (lg/xl, muted, pretty)
</Lead>

// Large - Texto grande
<Large>Texto grande e destacado (lg, semibold)</Large>

// Small - Texto pequeno
<Small>Texto de apoio ou legenda (sm, muted)</Small>

// Muted - Texto secundário
<Muted>Texto com ênfase reduzida (sm, muted)</Muted>

// Subtle - Texto muito discreto
<Subtle>Texto muito pequeno e discreto (xs, muted)</Subtle>
```

**Props:**
- `variant?: 'default' | 'lead' | 'large' | 'small' | 'muted' | 'subtle'`
- `as?: 'p' | 'span' | 'div'` - Elemento HTML a ser renderizado
- `align?: 'left' | 'center' | 'right'` - Alinhamento do texto
- `balance?: boolean` - Aplica `text-balance` para melhor distribuição de linhas
- `pretty?: boolean` - Aplica `text-pretty` para melhor quebra de palavras
- `className?: string` - Classes CSS adicionais

### Blockquote (Citação)

```tsx
import { Blockquote } from '@/components/ui/typography';

<Blockquote>
  "Esta é uma citação importante que precisa de destaque visual."
</Blockquote>
```

### Code (Código)

```tsx
import { Code } from '@/components/ui/typography';

// Inline code (padrão)
<p>Use o comando <Code>npm install</Code> para instalar.</p>

// Block code
<Code inline={false}>
  {`function exemplo() {
  return 'Hello World';
}`}
</Code>
```

**Props:**
- `inline?: boolean` - Se `true` (padrão), renderiza inline; se `false`, renderiza como bloco

### List (Listas)

```tsx
import { List, ListItem } from '@/components/ui/typography';

// Lista não-ordenada (padrão)
<List>
  <ListItem>Primeiro item</ListItem>
  <ListItem>Segundo item</ListItem>
  <ListItem>Terceiro item</ListItem>
</List>

// Lista ordenada
<List ordered>
  <ListItem>Primeiro passo</ListItem>
  <ListItem>Segundo passo</ListItem>
  <ListItem>Terceiro passo</ListItem>
</List>
```

**Props (List):**
- `ordered?: boolean` - Se `true`, renderiza como `<ol>`; se `false` (padrão), como `<ul>`

### SectionHeader (Cabeçalho de Seção)

Componente composto para cabeçalhos de seção com ícone opcional.

```tsx
import { SectionHeader } from '@/components/ui/typography';
import { Target } from 'lucide-react';

<SectionHeader
  icon={<Target className="h-5 w-5 text-primary" />}
  iconBgColor="bg-primary/10"
  title="Escolha Seu Exame"
  subtitle="Selecione o exame para o qual você está se preparando"
/>
```

**Props:**
- `icon?: React.ReactNode` - Ícone a ser exibido
- `iconBgColor?: string` - Cor de fundo do container do ícone (padrão: `bg-primary/10`)
- `title: string` - Título da seção (obrigatório)
- `subtitle?: string` - Subtítulo opcional

## Exemplos de Uso

### Página Hero

```tsx
import { H1, Lead } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

<section className="py-16 text-center">
  <Badge variant="secondary" className="mb-4">
    Novo Recurso
  </Badge>
  <H1>
    Domine Seus Exames com Prática Inteligente
  </H1>
  <Lead>
    Pratique milhares de questões de vestibular com dicas e soluções 
    fornecidas por IA.
  </Lead>
</section>
```

### Seção de Conteúdo

```tsx
import { SectionHeader, Text, List, ListItem } from '@/components/ui/typography';
import { BookOpen } from 'lucide-react';

<section>
  <SectionHeader
    icon={<BookOpen className="h-5 w-5 text-primary" />}
    title="Como Funciona"
    subtitle="Três passos simples para começar"
  />
  
  <List ordered>
    <ListItem>
      <Text>Selecione suas matérias de interesse</Text>
    </ListItem>
    <ListItem>
      <Text>Escolha o exame que deseja praticar</Text>
    </ListItem>
    <ListItem>
      <Text>Comece a resolver questões com ajuda da IA</Text>
    </ListItem>
  </List>
</section>
```

### Card de Feature

```tsx
import { H3, Small } from '@/components/ui/typography';
import { Card } from '@/components/ui/card';

<Card className="p-6 text-center">
  <div className="mb-4">
    {/* Ícone */}
  </div>
  <H3>Dicas com IA</H3>
  <Small>
    Receba dicas inteligentes quando estiver travado sem revelar 
    a solução completa
  </Small>
</Card>
```

## Utilitários de Texto Tailwind

Os componentes suportam utilitários importantes do Tailwind:

- **`text-balance`**: Melhora a distribuição de linhas em títulos
- **`text-pretty`**: Melhora a quebra de palavras em parágrafos
- **`text-wrap`**: Controla a quebra de texto
- **`text-nowrap`**: Previne quebra de linha

Exemplo:
```tsx
<H1 className="text-balance">
  Título longo que será distribuído de forma equilibrada
</H1>

<Lead pretty>
  Parágrafo longo que terá quebras de linha mais inteligentes.
</Lead>
```

## Cores de Texto

Os componentes já aplicam as cores corretas do tema:

- `text-foreground`: Texto principal
- `text-muted-foreground`: Texto secundário/menos importante
- `text-card-foreground`: Texto dentro de cards (herda automaticamente)

Para sobrescrever, use `className`:
```tsx
<Text className="text-destructive">Texto de erro</Text>
<Small className="text-primary">Texto destacado</Small>
```

## Responsividade

Muitos componentes incluem breakpoints responsivos por padrão:

- `H1`: `text-4xl md:text-6xl`
- `H2`: `text-2xl md:text-3xl`
- `H3`: `text-lg md:text-xl`
- `Lead`: `text-lg md:text-xl`

Não sobrescreva os estilos padrão, para evitar prejudicar a consistência.
```

## Composição com shadcn/ui

Os componentes de tipografia funcionam perfeitamente com componentes shadcn/ui:

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { H3, Text } from '@/components/ui/typography';

<Card>
  <CardHeader>
    <H3>Título do Card</H3>
  </CardHeader>
  <CardContent>
    <Text>Conteúdo do card com tipografia consistente.</Text>
  </CardContent>
</Card>
```

## Acessibilidade

- Use a hierarquia semântica correta de headings (H1 → H2 → H3, etc.)
- Evite pular níveis de heading (ex: H1 → H3)
- Use `Lead` para parágrafos introdutórios importantes

## Boas Práticas

1. **Consistência**: Use os componentes ao invés de classes Tailwind diretas
2. **Hierarquia**: Mantenha hierarquia visual e semântica clara
3. **Composição**: Combine componentes para criar padrões reutilizáveis
4. **Customização**: Use `className` para ajustes específicos quando necessário, mas evite sobrescrever estilos padronizados
5. **Responsividade**: Aproveite os breakpoints padrão ou adicione os seus próprios

## Type Safety

Todos os componentes são totalmente tipados com TypeScript e incluem:
- Props específicas para cada componente
- Herança de props HTML nativas
- Variantes tipadas via `class-variance-authority`
- Suporte completo a `ref` com `forwardRef`
