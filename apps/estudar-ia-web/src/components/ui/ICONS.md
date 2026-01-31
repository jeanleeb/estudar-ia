# Icon System

This file documents the centralized icon system used throughout the application.

## Overview

All image-based icons (from Lucide React) are centralized in `icon.tsx` to ensure consistency across the application. This system provides:

- **Standardized sizes** - Limited set of predefined sizes for visual consistency
- **Semantic naming** - Icons are named based on their purpose in the app
- **Type safety** - Full TypeScript support with proper types
- **Easy customization** - Support for className, color, and other SVG props

## Icon Sizes

The icon system provides 6 standardized sizes:

| Size | Dimensions | Usage |
|------|------------|-------|
| `xs` | 12px (h-3 w-3) | Badges, small indicators, inline with small text |
| `sm` | 16px (h-4 w-4) | Inline text, small buttons, compact UI |
| `md` | 20px (h-5 w-5) | **Default** - Section headers, standard UI elements |
| `lg` | 24px (h-6 w-6) | Headers, prominent UI elements, app logo |
| `xl` | 32px (h-8 w-8) | Feature cards, large displays |
| `2xl` | 64px (h-16 w-16) | Hero sections, main features, emphasis |

## Available Icons

### BrainIcon
**Purpose:** AI/Intelligence features

**Usage:**
```tsx
import { BrainIcon } from '@/components/ui/icon';

<BrainIcon size="lg" className="text-primary" />
```

**Common uses:**
- App logo
- AI features
- Intelligent hints
- Study assistance

---

### TargetIcon
**Purpose:** Goals and objectives

**Usage:**
```tsx
import { TargetIcon } from '@/components/ui/icon';

<TargetIcon size="md" className="text-primary" />
```

**Common uses:**
- Exam selection
- Targeted practice
- Focus areas
- Goal setting

---

### BookOpenIcon
**Purpose:** Learning and reading materials

**Usage:**
```tsx
import { BookOpenIcon } from '@/components/ui/icon';

<BookOpenIcon size="md" className="text-secondary" />
```

**Common uses:**
- Subject selection
- Study materials
- Detailed solutions
- Learning content

---

### SparklesIcon
**Purpose:** New features and highlights

**Usage:**
```tsx
import { SparklesIcon } from '@/components/ui/icon';

<SparklesIcon size="xs" />
```

**Common uses:**
- New feature badges
- Highlights
- Special announcements
- Premium features

---

## Usage Examples

### Basic Usage
```tsx
import { BrainIcon } from '@/components/ui/icon';

// Default size (md)
<BrainIcon />

// Custom size
<BrainIcon size="xl" />

// With color
<BrainIcon size="lg" className="text-primary" />

// With multiple classes
<BrainIcon size="sm" className="text-muted-foreground hover:text-primary" />
```

### In Components
```tsx
import { TargetIcon } from '@/components/ui/icon';

function ExamCard() {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary/10 p-2">
        <TargetIcon size="md" className="text-primary" />
      </div>
      <span>Select your exam</span>
    </div>
  );
}
```

### With Icon Container
```tsx
import { BookOpenIcon } from '@/components/ui/icon';

function FeatureIcon() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
      <BookOpenIcon size="xl" className="text-primary" />
    </div>
  );
}
```

## Adding New Icons

When adding new icons to the system:

1. **Import from Lucide React**
```tsx
import { NewIcon } from 'lucide-react';
```

2. **Create a semantic wrapper**
```tsx
export interface NewIconNameProps
  extends Omit<IconProps, 'icon'>,
    VariantProps<typeof iconVariants> {}

const NewIconName = React.forwardRef<SVGSVGElement, NewIconNameProps>(
  (props, ref) => <Icon ref={ref} icon={NewIcon} {...props} />,
);
NewIconName.displayName = 'NewIconName';
```

3. **Export the icon**
```tsx
export { NewIconName };
```

4. **Document in this file** - Add usage examples and purpose

## Guidelines

### DO ✅

- **Use semantic icon names** based on purpose (e.g., `BrainIcon` not `AiIcon`)
- **Use standard sizes** - Choose from xs, sm, md, lg, xl, 2xl
- **Use with design system colors** - `text-primary`, `text-secondary`, etc.
- **Document new icons** - Update this file when adding icons

### DON'T ❌

- **Don't use custom sizes** - Avoid `h-7 w-7` or similar custom classes
- **Don't import Lucide directly** - Always use the centralized icon system
- **Don't hardcode colors** - Use design system color classes
- **Don't create duplicate icons** - Reuse existing icons when possible

## Unicode Icons

Unicode icons (emojis) are **NOT** managed by this system. They can be used directly:

```tsx
// ✅ Correct - Unicode icons are used directly
const subjects = [
  { icon: '⚛️', name: 'Physics' },
  { icon: '📚', name: 'Portuguese' },
  { icon: '🏛️', name: 'History' },
];

// Render
<span className="text-4xl">{subject.icon}</span>
```

**Unicode icons are appropriate for:**
- Subject emojis
- Decorative elements
- User-facing content where variety is needed

**Image icons (from this system) are appropriate for:**
- UI controls
- Navigation
- System features
- Consistent brand elements

## Consistency Benefits

By centralizing icons:

1. **Visual Consistency** - All icons use the same size scale
2. **Easy Updates** - Change an icon once, updates everywhere
3. **Better DX** - Autocomplete and type safety for all icons
4. **Performance** - Tree-shaking only imports used icons
5. **Maintenance** - Easy to audit and update icon usage

## Migration

If you find direct Lucide imports in the codebase:

```tsx
// ❌ Before
import { Brain } from 'lucide-react';
<Brain className="h-6 w-6 text-primary" />

// ✅ After
import { BrainIcon } from '@/components/ui/icon';
<BrainIcon size="lg" className="text-primary" />
```
