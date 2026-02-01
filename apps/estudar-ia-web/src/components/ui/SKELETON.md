# Skeleton Component

The `Skeleton` component is a loading placeholder that displays an animated pulse effect to indicate content is being loaded. It's based on the shadcn/ui skeleton component and follows best practices for skeleton screens.

## Typography Shimmer Components (Recommended)

For text content, use the pre-built typography shimmer components from `typography.shimmer.tsx`. These components **automatically match** the heights and spacing of their corresponding typography components using **shared CVA variants** - ensuring perfect synchronization without manual maintenance.

```tsx
import {
  H3Shimmer,
  SmallShimmer,
  ParagraphShimmer,
  HeadingWithTextShimmer,
} from '@/components/ui/typography.shimmer';

function LoadingExample() {
  return (
    <div className="space-y-4">
      <H3Shimmer width="3/4" />
      <SmallShimmer width="full" />
      <ParagraphShimmer lines={3} />
    </div>
  );
}
```

### Available Typography Shimmer Components

All typography shimmers use **shared CVA variants** from `typography.tsx` for automatic consistency.

#### Heading Shimmers
- `H1Shimmer` - For H1 headings (uses `headingSpacingVariants` + `headingHeightVariants`)
- `H2Shimmer` - For H2 headings
- `H3Shimmer` - For H3 headings
- `H4Shimmer` - For H4 headings
- `H5Shimmer` - For H5 headings
- `H6Shimmer` - For H6 headings

#### Text Shimmers
- `TextShimmer` - For default text/paragraph (uses `textSpacingVariants` + `textHeightVariants`)
- `LeadShimmer` - For lead paragraph
- `LargeShimmer` - For large text
- `SmallShimmer` - For small text
- `MutedShimmer` - For muted text
- `SubtleShimmer` - For subtle text

#### Multi-line Shimmers
- `ParagraphShimmer` - Multiple lines with customizable count
- `HeadingWithTextShimmer` - Heading + text lines combination

### Width Variants

All typography shimmer components support predefined width variants:

```tsx
<H3Shimmer width="full" />   // w-full (default)
<H3Shimmer width="3/4" />    // w-3/4
<H3Shimmer width="2/3" />    // w-2/3
<H3Shimmer width="1/2" />    // w-1/2
<H3Shimmer width="1/3" />    // w-1/3
<H3Shimmer width="1/4" />    // w-1/4
```

### Examples

```tsx
// Single heading
<H2Shimmer width="3/4" />

// Heading with description
<div className="space-y-2">
  <H3Shimmer width="2/3" />
  <SmallShimmer width="full" />
</div>

// Multiple paragraph lines
<ParagraphShimmer lines={4} spacing="space-y-3" />

// Heading with text (composite)
<HeadingWithTextShimmer level="h3" textLines={2} />
```

## Basic Skeleton Usage

For custom layouts that don't match typography components, use the base `Skeleton` component:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

function LoadingExample() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
}
```

## Common Patterns

### Text Loading

```tsx
// Single line text
<Skeleton className="h-4 w-full" />

// Multiple lines
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <Skeleton className="h-4 w-4/6" />
</div>

// Heading + paragraph
<div className="space-y-3">
  <Skeleton className="h-6 w-3/4" /> {/* Title */}
  <Skeleton className="h-4 w-full" /> {/* Description */}
</div>
```

### Avatar/Image Loading

```tsx
// Circle avatar
<Skeleton className="h-12 w-12 rounded-full" />

// Square image
<Skeleton className="h-48 w-full rounded-lg" />

// Card with image
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

### Card Loading

```tsx
function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
```

## Creating Component-Specific Shimmers

When creating loading states for specific components, create a separate `.shimmer.tsx` file that matches the component's layout exactly. This ensures smooth transitions between loading and loaded states.

### Approach 1: Using Typography Shimmer Components (Strongly Recommended)

For text-based components, use the pre-built typography shimmer components. These use **shared CVA variants** ensuring automatic synchronization with typography changes:

```tsx
// exam-selection-card.shimmer.tsx
import { Card } from '@/components/ui/card';
import { H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';
import { cn } from '@/lib/utils';
import {
  examSelectionCardContentVariants,
  examSelectionCardLayoutVariants,
} from './exam-selection-card';

export function ExamSelectionCardShimmer() {
  return (
    <Card className="border-2 border-border bg-card">
      <div className={cn(examSelectionCardLayoutVariants())}>
        <div className={cn(examSelectionCardContentVariants(), 'w-full')}>
          <H3Shimmer width="3/4" />
          <SmallShimmer width="full" />
        </div>
      </div>
    </Card>
  );
}
```

### Approach 2: Using Shared CVA Variants

For maximum consistency and maintainability, use `class-variance-authority` (CVA) to define shared layout variants that both the real component and shimmer can use.

```tsx
// my-component.tsx
import { cva } from 'class-variance-authority';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Export shared variants for use in shimmer
export const myComponentLayoutVariants = cva(
  'flex items-start justify-between'
);

export const myComponentContentVariants = cva('space-y-2');

export function MyComponent({ title, description }) {
  return (
    <Card className="p-4">
      <div className={cn(myComponentLayoutVariants())}>
        <div className={cn(myComponentContentVariants())}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
```

```tsx
// my-component.shimmer.tsx
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  myComponentContentVariants,
  myComponentLayoutVariants,
} from './my-component';

export function MyComponentShimmer() {
  return (
    <Card className="p-4">
      <div className={cn(myComponentLayoutVariants())}>
        <div className={cn(myComponentContentVariants(), 'w-full')}>
          {/* Match typography line-heights: text-lg = h-7, text-sm = h-5 */}
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
    </Card>
  );
}
```

### Approach 3: Simple Component Shimmer

For simpler cases without shared variants or custom layouts:

```tsx
// my-component.shimmer.tsx
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MyComponentShimmer() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="w-full space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  );
}
```

### Usage in Parent Component

```tsx
import { MyComponent } from './my-component';
import { MyComponentShimmer } from './my-component.shimmer';

function ParentComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {isLoading ? (
        <>
          <MyComponentShimmer />
          <MyComponentShimmer />
        </>
      ) : (
        data?.map(item => (
          <MyComponent key={item.id} {...item} />
        ))
      )}
    </div>
  );
}
```

## Customization

The Skeleton component accepts all standard HTML div attributes and can be customized with Tailwind classes:

```tsx
// Custom size
<Skeleton className="h-20 w-20" />

// Custom rounded corners
<Skeleton className="h-10 w-full rounded-xl" />

// Custom spacing
<div className="space-y-4">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
</div>
```

## Matching Typography Heights

When creating skeletons for text content, match the line-heights of Tailwind typography classes:

| Typography Class | Line Height | Skeleton Height |
|-----------------|-------------|-----------------|
| `text-xs` | 1rem (16px) | `h-4` |
| `text-sm` | 1.25rem (20px) | `h-5` |
| `text-base` | 1.5rem (24px) | `h-6` |
| `text-lg` | 1.75rem (28px) | `h-7` |
| `text-xl` | 1.75rem (28px) | `h-7` |
| `text-2xl` | 2rem (32px) | `h-8` |

Example:
```tsx
{/* For text-lg heading */}
<Skeleton className="h-7 w-3/4" />

{/* For text-sm description */}
<Skeleton className="h-5 w-full" />
```

## Best Practices

1. **Use typography shimmer components**: For text content, always prefer the pre-built typography shimmer components (`H3Shimmer`, `SmallShimmer`, etc.) over raw `Skeleton` components - they use shared variants for automatic synchronization
2. **Leverage shared variants**: Typography shimmers automatically stay in sync with typography changes via shared CVA variants (no manual maintenance!)
3. **Use shared CVA variants for layouts**: Export layout variants from the main component and reuse in shimmer for perfect consistency
4. **Match the layout**: Shimmer components should match the exact layout of the actual component for smooth transitions
5. **Use realistic dimensions**: Match the typical height and width of the content being loaded
6. **Show multiple items**: Display 2-3 skeleton items to indicate a list is loading
7. **Maintain spacing**: Use the same spacing (gaps, padding, margins) as the actual content
8. **File naming**: Use `.shimmer.tsx` suffix for component-specific loading states
9. **Export alongside component**: Export shimmer components and shared variants from the same index file as the main component
10. **Trust the system**: Don't hardcode heights/margins that duplicate typography values - use the shared variants

## Animation

The skeleton uses the `animate-pulse` Tailwind utility by default, which provides a smooth pulsing animation. This is applied automatically and requires no additional configuration.

## Accessibility

The skeleton component is purely visual and doesn't require additional accessibility attributes. However, ensure that:

1. Loading states are announced to screen readers using ARIA live regions when appropriate
2. The actual content is properly labeled when it loads
3. Loading states don't trap keyboard focus

## Maintenance Advantage

The key benefit of using typography shimmer components is **automatic synchronization**:

```tsx
// If you change H3 in typography.tsx from mb-2 to mb-4:
export const headingSpacingVariants = cva('', {
  variants: { level: { h3: 'mb-4' } } // Changed from mb-2
});

// H3Shimmer automatically updates - no code changes needed!
<H3Shimmer width="3/4" /> // Now uses mb-4 automatically
```

This eliminates an entire class of maintenance bugs and ensures your loading states always match your actual content.

## See Also

- [Typography Shimmer Components](./typography.shimmer.tsx) - Pre-built shimmer components with shared variants
- [Typography Shimmer Documentation](./TYPOGRAPHY_SHIMMER.md) - Comprehensive guide including architecture details
- [ExamSelectionCardShimmer](../home/exam-selection-card.shimmer.tsx) - Example implementation with typography shimmers
- [ExamSelectionCard](../home/exam-selection-card.tsx) - Example of shared CVA variants
- [Typography Components](./typography.tsx) - Base typography components with exported variants
- [Card Component](./card.tsx) - Often used with skeleton loading
- [class-variance-authority](https://cva.style/docs) - CVA documentation