# Shared Components

This directory contains reusable components that can be used across multiple pages and features of the application.

## Components

### AppHeader

Main application header component with logo, navigation, and action button.

**Props:**
- `appName?: string` - Custom app name (defaults to localized app name)
- `showNavigation?: boolean` - Show/hide navigation menu (default: true)
- `navigationItems?: React.ReactNode` - Custom navigation items
- `actionButton?: React.ReactNode` - Custom action button (e.g., sign in/profile)
- `logo?: React.ReactNode` - Custom logo/icon

**Usage:**
```tsx
import { AppHeader } from '@/components/shared';

// Basic usage
<AppHeader />

// Custom usage
<AppHeader
  actionButton={<Button>Profile</Button>}
  showNavigation={false}
/>
```

---

### HeroSection

Reusable hero section component for landing pages with badge, title, description, and optional actions.

**Props:**
- `badge?: { icon?: ReactNode; text: string; variant?: BadgeVariant }` - Optional badge above title
- `title: string` - Main title (required)
- `description?: string` - Lead text below title
- `actions?: React.ReactNode` - Optional action buttons/CTA
- `maxWidth?: string` - Content max width (default: 'max-w-3xl')
- `className?: string` - Additional section classes
- `containerClassName?: string` - Additional container classes

**Usage:**
```tsx
import { HeroSection } from '@/components/shared';
import { Sparkles } from 'lucide-react';

<HeroSection
  badge={{
    icon: <Sparkles className="h-3 w-3" />,
    text: "New Feature",
    variant: "secondary"
  }}
  title="Welcome to our app"
  description="Start your journey today"
  actions={<Button>Get Started</Button>}
/>
```

---

### SelectableCard

Generic selectable card component with visual feedback for selected state. Ideal for selection interfaces.

**Props:**
- `selected: boolean` - Whether the card is selected (required)
- `onSelect: () => void` - Click handler (required)
- `children: React.ReactNode` - Card content (required)
- `selectedIndicator?: React.ReactNode` - Custom selected indicator (defaults to checkmark)
- `className?: string` - Additional card classes
- `disabled?: boolean` - Disable interaction (default: false)

**Usage:**
```tsx
import { SelectableCard } from '@/components/shared';

<SelectableCard
  selected={isSelected}
  onSelect={() => setSelected(true)}
>
  <h3>Option 1</h3>
  <p>Description</p>
</SelectableCard>
```

**Features:**
- Automatic hover/selected state styling
- Default checkmark indicator
- Supports custom selected indicators
- Disabled state support

---

### FeatureCard

Feature card component with icon, title, and description. Commonly used in marketing/landing sections.

**Props:**
- `icon: React.ReactNode` - Icon to display (required)
- `iconBgColor?: string` - Icon background color class (default: 'bg-primary/10')
- `title: string` - Feature title (required)
- `description: string` - Feature description (required)
- `className?: string` - Additional container classes

**Usage:**
```tsx
import { FeatureCard } from '@/components/shared';
import { Brain } from 'lucide-react';

<FeatureCard
  icon={<Brain className="h-8 w-8 text-primary" />}
  iconBgColor="bg-primary/10"
  title="AI-Powered Hints"
  description="Get intelligent hints when you're stuck"
/>
```

---

## Design Principles

### Reusability
All components in this directory are designed to be reusable across different pages and features. They accept flexible props to accommodate various use cases.

### Consistency
Components follow the application's design system, using tokens from the UI library (colors, typography, spacing).

### Composability
Components are designed to work well together and can be composed to create more complex interfaces.

### Accessibility
Components include proper semantic HTML, ARIA attributes where needed, and keyboard support.

## Usage Guidelines

### When to use Shared components
- The component pattern appears in multiple pages/features
- The component represents a common UI pattern (e.g., cards, headers)
- The component is generic enough to be configured via props

### When NOT to use Shared components
- The component is too specific to a single feature
- The component requires extensive customization per use case
- The component is still evolving and its API is unstable

For feature-specific components, use the appropriate feature directory (e.g., `@/components/home`).