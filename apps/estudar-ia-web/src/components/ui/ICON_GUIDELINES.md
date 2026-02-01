# Icon Usage Guidelines

> **CRITICAL: All icons MUST be imported from `@/components/ui/icon` - NEVER from `lucide-react` directly**

## 🎯 Purpose

This document establishes strict guidelines for icon usage in the application to ensure:
- **Visual consistency** across the entire app
- **Centralized management** of all icons
- **Type safety** and standardized sizing
- **Easy maintenance** and updates
- **Prevention of inconsistencies** from direct lucide-react imports

## 🚫 What NOT to Do

### ❌ NEVER Import from lucide-react Directly

```tsx
// ❌ WRONG - Direct import from lucide-react
import { AlertCircle, RefreshCw } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <AlertCircle className="h-5 w-5" />
      <RefreshCw className="h-4 w-4" />
    </div>
  );
}
```

### ❌ NEVER Use Inline SVGs for Icons

```tsx
// ❌ WRONG - Inline SVG that duplicates an existing icon
function MyComponent() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <path d="..." />
    </svg>
  );
}
```

### ❌ NEVER Use Arbitrary Size Classes

```tsx
// ❌ WRONG - Arbitrary sizes break consistency
import { BrainIcon } from '@/components/ui/icon';

function MyComponent() {
  return <BrainIcon className="h-7 w-7" />; // Non-standard size
}
```

## ✅ Correct Usage

### ✅ Import from Centralized Icon System

```tsx
// ✅ CORRECT - Import from centralized system
import { AlertCircleIcon, RefreshCwIcon } from '@/components/ui/icon';

function MyComponent() {
  return (
    <div>
      <AlertCircleIcon size="md" />
      <RefreshCwIcon size="sm" />
    </div>
  );
}
```

### ✅ Use Standardized Sizes

```tsx
import { BrainIcon } from '@/components/ui/icon';

function MyComponent() {
  return (
    <div>
      {/* Available sizes: xs, sm, md (default), lg, xl, 2xl */}
      <BrainIcon size="xs" />  {/* 12px - badges, indicators */}
      <BrainIcon size="sm" />  {/* 16px - inline text, small buttons */}
      <BrainIcon size="md" />  {/* 20px - default, section headers */}
      <BrainIcon size="lg" />  {/* 24px - headers, prominent UI */}
      <BrainIcon size="xl" />  {/* 32px - feature cards */}
      <BrainIcon size="2xl" /> {/* 64px - hero sections */}
    </div>
  );
}
```

### ✅ Add Custom Classes for Colors Only

```tsx
import { TargetIcon } from '@/components/ui/icon';

function MyComponent() {
  return (
    <div>
      <TargetIcon size="lg" className="text-primary" />
      <TargetIcon size="md" className="text-destructive" />
      <TargetIcon size="sm" className="text-muted-foreground" />
    </div>
  );
}
```

## 📚 Available Icons

### Current Application Icons

| Icon Name | Component | Usage |
|-----------|-----------|-------|
| Brain | `BrainIcon` | AI features, intelligence, app logo |
| Book Open | `BookOpenIcon` | Reading, learning, study materials, solutions |
| Target | `TargetIcon` | Goals, exams, targeted practice, focus |
| Sparkles | `SparklesIcon` | New features, highlights, special badges |
| Alert Circle | `AlertCircleIcon` | Errors, warnings, alerts |
| Refresh | `RefreshCwIcon` | Retry actions, refresh, reload |
| Smile | `SmileIcon` | Empty states, positive feedback, no data |
| Circle | `CircleIcon` | Radio buttons, indicators, selection states |
| Check | `CheckIcon` | Selection indicators, success states, completed items |

### Example Usage

```tsx
import {
  BrainIcon,
  BookOpenIcon,
  TargetIcon,
  SparklesIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  SmileIcon,
  CircleIcon,
  CheckIcon,
} from '@/components/ui/icon';

function FeatureSection() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <BrainIcon size="lg" className="text-primary" />
        <h2>AI-Powered Learning</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <TargetIcon size="md" className="text-secondary" />
        <h3>Targeted Practice</h3>
      </div>
      
      <button className="flex items-center gap-2">
        <RefreshCwIcon size="sm" />
        Retry
      </button>
    </div>
  );
}
```

## 🔧 Adding New Icons

### Step 1: Check if Icon Already Exists

Before adding a new icon, verify it doesn't already exist in `icon.tsx`.

### Step 2: Add to icon.tsx

```tsx
// In src/components/ui/icon.tsx

// 1. Import from lucide-react
import { 
  // ... existing imports
  NewIconName, // Add your new icon here
} from 'lucide-react';

// 2. Create interface
export interface NewIconNameIconProps
  extends Omit<IconProps, 'icon'>,
    VariantProps<typeof iconVariants> {}

// 3. Create component
const NewIconNameIcon = React.forwardRef<SVGSVGElement, NewIconNameIconProps>(
  (props, ref) => <Icon ref={ref} icon={NewIconName} {...props} />,
);
NewIconNameIcon.displayName = 'NewIconNameIcon';

// 4. Add JSDoc comment explaining usage
/**
 * NewIconNameIcon - Brief description
 * Used for: Specific use cases
 */

// 5. Export in the exports section
export {
  // ... existing exports
  NewIconNameIcon,
};
```

### Step 3: Document in This File

Add the new icon to the "Available Icons" table above.

### Step 4: Update Components

Use the new icon in your components:

```tsx
import { NewIconNameIcon } from '@/components/ui/icon';

function MyComponent() {
  return <NewIconNameIcon size="md" className="text-primary" />;
}
```

## 🛡️ Type Safety

The icon system is fully type-safe:

```tsx
import { type IconSize, BrainIcon } from '@/components/ui/icon';

// Valid sizes (TypeScript enforced)
const validSizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

function IconDisplay() {
  return (
    <div>
      <BrainIcon size="md" /> {/* ✅ Valid */}
      <BrainIcon size="invalid" /> {/* ❌ TypeScript error */}
      <BrainIcon className="h-9 w-9" /> {/* ⚠️ Works but breaks consistency */}
    </div>
  );
}
```

## 🔍 Verification

### Manual Check

Before committing code, verify:

1. ✅ No imports from `lucide-react` directly
2. ✅ All icons use standardized sizes
3. ✅ No inline SVGs that duplicate existing icons
4. ✅ All new icons are added to `icon.tsx`

### Search for Violations

Use these commands to find potential violations:

```bash
# Find direct lucide-react imports (should only be in icon.tsx)
grep -r "from 'lucide-react'" src/components --exclude-dir=node_modules

# Find inline SVGs (review manually)
grep -r "<svg" src/components --exclude-dir=node_modules

# Find arbitrary size classes (h-* w-* that aren't in iconVariants)
grep -r "className.*[\"'].*h-[0-9]" src/components --exclude-dir=node_modules
```

## 📋 Code Review Checklist

When reviewing PRs, check:

- [ ] All icon imports are from `@/components/ui/icon`
- [ ] No direct imports from `lucide-react` (except in `icon.tsx`)
- [ ] No inline SVGs for common icons
- [ ] All icons use standardized `size` prop
- [ ] New icons are properly documented
- [ ] Icon usage is semantically correct

## 🎨 Design Principles

### 1. Consistency Over Flexibility

We prioritize visual consistency over individual flexibility. Limited size options ensure uniform appearance.

### 2. Single Source of Truth

`icon.tsx` is the single source of truth for all icons. This enables:
- Easy global updates
- Consistent sizing
- Better tree-shaking
- Type safety

### 3. Semantic Icon Names

Icon components are named by their purpose, not their appearance:
- `BrainIcon` for AI features (not `CogIcon` or `ProcessorIcon`)
- `TargetIcon` for goals (not `CircleDotIcon`)
- `SmileIcon` for empty states (not `HappyIcon`)

### 4. Composability

Icons integrate seamlessly with other components:

```tsx
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from '@/components/ui/icon';

<Button className="gap-2">
  <RefreshCwIcon size="sm" />
  Retry
</Button>
```

## 🚨 Common Mistakes and Fixes

### Mistake 1: Direct Import

```tsx
// ❌ Before
import { Brain } from 'lucide-react';
<Brain className="h-5 w-5" />

// ✅ After
import { BrainIcon } from '@/components/ui/icon';
<BrainIcon size="md" />
```

### Mistake 2: Inline SVG

```tsx
// ❌ Before
<svg viewBox="0 0 24 24" className="h-5 w-5">
  <circle cx="12" cy="12" r="10" />
  <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
</svg>

// ✅ After
import { SmileIcon } from '@/components/ui/icon';
<SmileIcon size="md" />
```

### Mistake 3: Custom Size Classes

```tsx
// ❌ Before
<BrainIcon className="h-7 w-7" />

// ✅ After - Use closest standard size
<BrainIcon size="lg" /> // 24px (h-6 w-6)
// or
<BrainIcon size="xl" /> // 32px (h-8 w-8)
```

## 📖 References

- Lucide Icons: https://lucide.dev/icons/
- Icon System Implementation: `src/components/ui/icon.tsx`
- Component Usage: Search codebase for `import { ... } from '@/components/ui/icon'`

## 🔄 Migration from Direct Imports

If you find components using direct lucide-react imports:

1. Identify the icon being used
2. Check if it exists in `icon.tsx` (see Available Icons table)
3. If it exists, update the import
4. If it doesn't exist, add it following "Adding New Icons" steps
5. Update all usages to use the standardized size prop

## ✅ Enforcement

### Pre-commit Checks

Consider adding these checks to your workflow:

```bash
# Check for direct lucide-react imports outside icon.tsx
if grep -r "from 'lucide-react'" src/components --exclude=icon.tsx; then
  echo "❌ Found direct lucide-react imports. Use @/components/ui/icon instead."
  exit 1
fi
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Verify Icon Usage
  run: |
    # Ensure only icon.tsx imports from lucide-react
    VIOLATIONS=$(grep -r "from 'lucide-react'" src/components --exclude=icon.tsx | wc -l)
    if [ $VIOLATIONS -gt 0 ]; then
      echo "Found $VIOLATIONS violations of icon guidelines"
      exit 1
    fi
```

---

**Last Updated:** 2024  
**Maintained by:** Development Team  
**Questions?** Refer to this document or ask in team chat

**Remember: Consistency in icons = Better user experience** 🎯