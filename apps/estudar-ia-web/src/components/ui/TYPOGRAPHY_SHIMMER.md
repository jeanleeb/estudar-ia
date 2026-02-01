# Typography Shimmer Components

Pre-built skeleton loading components that match all typography elements for consistent loading states across your application.

## Why Use Typography Shimmers?

- ✅ **Perfect Alignment**: Heights automatically match corresponding typography components
- ✅ **Consistent Spacing**: Margins and padding match exactly via shared CVA variants
- ✅ **Easy to Use**: Simple API with predefined width variants
- ✅ **Automatically Maintained**: Uses shared variants from typography.tsx - any changes to typography spacing/heights are automatically reflected in shimmer components
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **DRY Principle**: Single source of truth for spacing and height values
- ✅ **True Composition**: Both real and shimmer components use the exact same spacing/height variants

## How It Works

Typography shimmer components use **extracted spacing/height variants** from the same source as real typography components in `typography.tsx`.

### Architecture: Single Source of Truth

All typography styles are defined once in unified variant objects:
- `headingVariants` - Complete styles for all headings (spacing + visual)
- `textVariants` - Complete styles for all text variants (spacing + visual)

From these, spacing and height are **extracted** for shimmer use:
- `headingSpacingVariants` - Extracted margins (mb-6, mb-4, mb-2, etc.)
- `headingHeightVariants` - Calculated heights (h-12, h-8, h-7, etc.)
- `textSpacingVariants` - Extracted margins (mb-4, mb-6, mb-3, etc.)
- `textHeightVariants` - Calculated heights (h-6, h-7, h-5, etc.)

### How It Works

**Real Typography Components:**
```tsx
<H3>
  Uses: headingVariants({ level: 'h3' })
  → 'mb-2 text-lg md:text-xl font-semibold text-foreground'
```

**Shimmer Components:**
```tsx
<H3Shimmer>
  Uses: headingSpacingVariants({ level: 'h3' }) + headingHeightVariants({ level: 'h3' })
  → 'mb-2' + 'h-7'
  (extracted from same source!)
```

This ensures:
1. **Single source of truth**: Spacing defined once in `headingVariants`
2. **Automatic synchronization**: Shimmer extracts from same variants
3. **No duplication**: Spacing values never repeated
4. **Simple**: No over-engineering, just extraction of needed values

## Quick Start

```tsx
import { H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';

function MyComponentShimmer() {
  return (
    <div className="space-y-2">
      <H3Shimmer width="3/4" />
      <SmallShimmer width="full" />
    </div>
  );
}
```

## Available Components

### Heading Shimmers

| Component | Matches | Height | Default Margin |
|-----------|---------|--------|----------------|
| `H1Shimmer` | `<H1>` | `h-12` (48px) | `mb-6` |
| `H2Shimmer` | `<H2>` | `h-8` (32px) | `mb-4` |
| `H3Shimmer` | `<H3>` | `h-7` (28px) | `mb-2` |
| `H4Shimmer` | `<H4>` | `h-6` (24px) | `mb-2` |
| `H5Shimmer` | `<H5>` | `h-5` (20px) | `mb-1.5` |
| `H6Shimmer` | `<H6>` | `h-4` (16px) | `mb-1` |

### Text Shimmers

| Component | Matches | Height | Default Margin |
|-----------|---------|--------|----------------|
| `TextShimmer` | `<Text>` | `h-6` (24px) | `mb-4` |
| `LeadShimmer` | `<Lead>` | `h-7` (28px) | `mb-6` |
| `LargeShimmer` | `<Large>` | `h-7` (28px) | `mb-3` |
| `SmallShimmer` | `<Small>` | `h-5` (20px) | - |
| `MutedShimmer` | `<Muted>` | `h-5` (20px) | - |
| `SubtleShimmer` | `<Subtle>` | `h-4` (16px) | - |

### Multi-line Shimmers

| Component | Description |
|-----------|-------------|
| `ParagraphShimmer` | Multiple skeleton lines with customizable count and spacing |
| `HeadingWithTextShimmer` | Heading + text lines combination |

## Width Variants

All single-line shimmer components support these width variants:

```tsx
<H3Shimmer width="full" />   // w-full (100%) - default
<H3Shimmer width="3/4" />    // w-3/4 (75%)
<H3Shimmer width="2/3" />    // w-2/3 (66.67%)
<H3Shimmer width="1/2" />    // w-1/2 (50%)
<H3Shimmer width="1/3" />    // w-1/3 (33.33%)
<H3Shimmer width="1/4" />    // w-1/4 (25%)
```

## Common Patterns

### Card with Title and Description

```tsx
import { H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';

function CardShimmer() {
  return (
    <Card>
      <div className="space-y-2">
        <H3Shimmer width="3/4" />
        <SmallShimmer width="full" />
      </div>
    </Card>
  );
}
```

### Section with Heading and Multiple Paragraphs

```tsx
import { H2Shimmer, ParagraphShimmer } from '@/components/ui/typography.shimmer';

function SectionShimmer() {
  return (
    <section>
      <H2Shimmer width="2/3" />
      <ParagraphShimmer lines={4} spacing="space-y-3" />
    </section>
  );
}
```

### Article Preview

```tsx
import { 
  H3Shimmer, 
  MutedShimmer, 
  ParagraphShimmer 
} from '@/components/ui/typography.shimmer';

function ArticlePreviewShimmer() {
  return (
    <article className="space-y-3">
      <H3Shimmer width="3/4" />
      <MutedShimmer width="1/3" /> {/* Date/author */}
      <ParagraphShimmer lines={3} />
    </article>
  );
}
```

### List of Items

```tsx
import { HeadingWithTextShimmer } from '@/components/ui/typography.shimmer';

function ListShimmer() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <HeadingWithTextShimmer 
          key={i} 
          level="h3" 
          textLines={2} 
        />
      ))}
    </div>
  );
}
```

### Profile Information

```tsx
import { 
  H2Shimmer, 
  SmallShimmer, 
  TextShimmer 
} from '@/components/ui/typography.shimmer';

function ProfileShimmer() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <H2Shimmer width="1/2" />
          <SmallShimmer width="1/3" />
        </div>
      </div>
      <TextShimmer width="full" />
      <TextShimmer width="3/4" />
    </div>
  );
}
```

## Advanced Usage

### ParagraphShimmer Options

```tsx
<ParagraphShimmer 
  lines={5}                    // Number of lines
  spacing="space-y-3"          // Spacing between lines
  lineHeight="h-6"             // Height of each line
  className="mt-4"             // Additional classes
/>
```

Available options:
- `lines`: `number` (default: `3`)
- `spacing`: `'space-y-1' | 'space-y-2' | 'space-y-3' | 'space-y-4'` (default: `'space-y-2'`)
- `lineHeight`: `'h-4' | 'h-5' | 'h-6' | 'h-7'` (default: `'h-5'`)
- `className`: `string` (optional)

### HeadingWithTextShimmer Options

```tsx
<HeadingWithTextShimmer 
  level="h2"                   // Heading level
  textLines={3}                // Number of text lines below heading
  className="my-6"             // Additional classes
/>
```

Available options:
- `level`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` (default: `'h3'`)
- `textLines`: `number` (default: `2`)
- `className`: `string` (optional)

### Custom Width

For custom widths beyond the predefined variants, use the `className` prop:

```tsx
<H3Shimmer className="w-[250px]" />
<SmallShimmer className="w-[85%]" />
```

## Integration with Component Shimmers

### Recommended Approach

```tsx
// my-card.tsx
import { cva } from 'class-variance-authority';
import { Card } from '@/components/ui/card';
import { H3, Small } from '@/components/ui/typography';

export const myCardLayoutVariants = cva('flex items-start justify-between');
export const myCardContentVariants = cva('space-y-2');

export function MyCard({ title, description }) {
  return (
    <Card>
      <div className={myCardLayoutVariants()}>
        <div className={myCardContentVariants()}>
          <H3>{title}</H3>
          <Small>{description}</Small>
        </div>
      </div>
    </Card>
  );
}
```

```tsx
// my-card.shimmer.tsx
import { Card } from '@/components/ui/card';
import { H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';
import { 
  myCardContentVariants, 
  myCardLayoutVariants 
} from './my-card';

export function MyCardShimmer() {
  return (
    <Card>
      <div className={myCardLayoutVariants()}>
        <div className={myCardContentVariants()}>
          <H3Shimmer width="3/4" />
          <SmallShimmer width="full" />
        </div>
      </div>
    </Card>
  );
}
```

## Best Practices

### ✅ Do

```tsx
// Use typography shimmers for text content (they use shared variants!)
<H3Shimmer width="3/4" />
<SmallShimmer width="full" />

// Match the structure of your real component
<div className="space-y-2">
  <H3Shimmer width="3/4" />
  <SmallShimmer width="full" />
</div>

// Use ParagraphShimmer for multi-line text
<ParagraphShimmer lines={3} />

// Combine with base Skeleton for non-text elements
<div className="flex gap-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="flex-1 space-y-2">
    <H3Shimmer width="2/3" />
    <SmallShimmer width="1/2" />
  </div>
</div>

// Trust the shared variants - they automatically match!
<H3Shimmer /> // Spacing and height are correct by default
```

### ❌ Don't

```tsx
// Don't use raw Skeleton for text content (loses automatic sync)
<Skeleton className="h-7 w-3/4 mb-2" /> // Use H3Shimmer instead

// Don't hardcode heights/margins that duplicate typography values
<Skeleton className="h-8 w-3/4 mb-4" /> // Brittle - use H2Shimmer

// Don't manually copy spacing values
// If H3 changes from mb-2 to mb-4 in typography.tsx,
// hardcoded values won't update automatically
```

### 🎯 Advantage of Shared Variants

```tsx
// ✅ GOOD: Automatically stays in sync
<H3Shimmer width="3/4" />
// If typography.tsx changes H3 margin, this updates automatically

// ❌ BAD: Manual maintenance required
<Skeleton className="mb-2 h-7 w-3/4" />
// If typography.tsx changes H3 margin, this needs manual update
```

## Accessibility

The shimmer components include basic accessibility features:

- `ParagraphShimmer` uses semantic `<output>` element
- Screen reader text announces "Loading content..."
- No focus trap or keyboard navigation issues

For better accessibility in your loading states:

```tsx
<div role="region" aria-label="Loading article">
  <H2Shimmer width="2/3" />
  <ParagraphShimmer lines={3} />
</div>
```

## Animation

All shimmer components use the `animate-pulse` utility from Tailwind, which provides a smooth 2-second pulsing animation. No additional configuration needed.

## Performance

Typography shimmer components are lightweight and performant:

- No JavaScript animation (uses CSS)
- Minimal DOM nodes
- Reusable component instances
- No layout shift when content loads (if properly sized)
- CVA variants are optimized and cached

## Maintenance Benefits

Using shared variants provides significant maintenance advantages:

1. **Single Source of Truth**: All spacing and heights defined once in `typography.tsx`
2. **Automatic Synchronization**: Change typography, shimmer updates automatically
3. **Type Safety**: TypeScript ensures variant consistency
4. **Reduced Errors**: No manual height/margin calculations needed
5. **Easier Refactoring**: Update design system in one place
6. **True DRY**: Shimmer components extract spacing from same source as real components

### Example Maintenance Scenario

**Before (Manual Sync - Error Prone):**
```tsx
// typography.tsx
h3: 'mb-2 text-lg md:text-xl'

// typography.shimmer.tsx
<Skeleton className="mb-2 h-7 w-3/4" />

// ❌ Problem: mb-2 duplicated! If H3 changes to mb-4, must update 2 places!
```

**After (Extracted Variants - Bulletproof):**
```tsx
// typography.tsx - Single variant definition
export const headingVariants = cva('font-semibold text-foreground', {
  variants: {
    level: {
      h3: 'mb-2 text-lg md:text-xl', // ← Single source of truth
    }
  }
});

// Extracted for shimmer use (mirrors spacing from above)
export const headingSpacingVariants = cva('', {
  variants: { level: { h3: 'mb-2' } } // ← Extracted from headingVariants
});

// typography.tsx - Real component
<H3>
  className={headingVariants({ level: 'h3' })}
  // Result: 'mb-2 text-lg md:text-xl font-semibold text-foreground'
</H3>

// typography.shimmer.tsx - Shimmer extracts spacing
<H3Shimmer>
  className={cn(
    headingSpacingVariants({ level: 'h3' }), // Extracted spacing: 'mb-2'
    headingHeightVariants({ level: 'h3' })   // Height: 'h-7'
  )}
</H3Shimmer>

// ✅ Solution: Change mb-2 to mb-4 in headingVariants + headingSpacingVariants
// Both components update automatically!
```

### Real-World Impact

**Scenario: Design system update - increase all heading margins**

**Manual approach (old way):**
- Update 6 heading levels in `headingVariants`
- Update 6 heading levels manually in shimmer components
- 12 total changes, high risk of missing one

**Extracted variants approach (new way):**
- Update 6 heading levels in `headingVariants`
- Update 6 heading levels in `headingSpacingVariants` (kept in sync)
- Shimmer components automatically use extracted spacing
- **Reduced duplication, clear single source of truth**

## Related Components

- [Skeleton](./skeleton.tsx) - Base skeleton component
- [Typography](./typography.tsx) - Typography components with shared variants
- [SKELETON.md](./SKELETON.md) - General skeleton documentation

## Architecture Details

For developers extending or modifying the system.

### Architecture Overview

The typography system uses **single variant definitions** with extracted spacing for shimmer:

```
Typography Variants:
┌─────────────────────────────────────────┐
│ headingVariants (complete styles)       │ ← Real components use this
│   'mb-6 text-4xl font-bold...'          │
├─────────────────────────────────────────┤
│ headingSpacingVariants (extracted)      │ ← Shimmer uses this
│   'mb-6' (mirrors spacing from above)   │
├─────────────────────────────────────────┤
│ headingHeightVariants (calculated)      │ ← Shimmer uses this
│   'h-12' (based on text size)           │
└─────────────────────────────────────────┘

Real Component = headingVariants (all styles)
Shimmer Component = headingSpacingVariants + headingHeightVariants
```

### Adding a New Typography Component

**Step 1:** Add to main variant definition:
```tsx
export const headingVariants = cva('font-semibold text-foreground', {
  variants: {
    level: {
      // ... existing
      h7: 'mb-0.5 text-xs', // New heading level
    },
  },
});
```

**Step 2:** Add spacing variant (extracted for shimmer):
```tsx
export const headingSpacingVariants = cva('', {
  variants: {
    level: {
      // ... existing
      h7: 'mb-0.5', // Mirrors spacing from headingVariants
    },
  },
});
```

**Step 3:** Add height variant (for shimmer):
```tsx
export const headingHeightVariants = cva('', {
  variants: {
    level: {
      // ... existing
      h7: 'h-3', // Matches line-height of text size
    },
  },
});
```

**Step 4:** Create real component (uses main variant):
```tsx
const H7 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, align, ...props }, ref) => {
    return React.createElement('h7', {
      className: cn(
        headingVariants({ level: 'h7', align }), // Uses complete variant
        className,
      ),
      ref,
      ...props,
    });
  },
);
```

**Step 5:** Create shimmer component (uses extracted spacing):
```tsx
export function H7Shimmer({ className, width = 'full' }) {
  return (
    <Skeleton
      className={cn(
        headingSpacingVariants({ level: 'h7' }), // Extracted spacing
        headingHeightVariants({ level: 'h7' }),  // Calculated height
        widthVariants[width],
        className,
      )}
    />
  );
}
```

**Result:** Change `mb-0.5` to `mb-1` in both `headingVariants` and `headingSpacingVariants`, and both components update!

### Architecture Guarantees

✅ **Single source of truth** - all styles defined in main variants (`headingVariants`)  
✅ **Extracted spacing** - `headingSpacingVariants` mirrors spacing from main variants  
✅ **Simple and clear** - no over-engineering, straightforward extraction  
✅ **Heights calculated once** - in `headingHeightVariants` based on text sizes  
✅ **Type-safe** - TypeScript ensures all variants are used correctly

## Examples in the Codebase

- [ExamSelectionCardShimmer](../home/exam-selection-card.shimmer.tsx) - Real-world example

## Quick Reference

```tsx
// Basic usage
import { H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';

// Headings
<H1Shimmer width="3/4" />
<H2Shimmer width="2/3" />
<H3Shimmer width="1/2" />

// Text
<SmallShimmer width="full" />
<MutedShimmer width="1/3" />
<TextShimmer width="3/4" />

// Multi-line
<ParagraphShimmer lines={3} />
<HeadingWithTextShimmer level="h3" textLines={2} />

// Custom width
<H3Shimmer className="w-[200px]" />
```
