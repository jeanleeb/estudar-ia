# Locales / Internationalization (i18n)

This directory contains all user-facing strings for the application, organized to support multiple languages in the future.

## Structure

```
locales/
├── index.ts           # Main entry point, exports current locale
├── pt-BR/             # Portuguese (Brazil) translations
│   ├── index.ts       # Exports all pt-BR translations
│   ├── common.ts      # Common strings (app name, navigation, etc.)
│   └── home.ts        # Home page specific strings
└── README.md          # This file
```

## Usage

Import the translations object from the main index file:

```tsx
import { t } from '@/locales';

// Use in your components
<h1>{t.home.hero.title}</h1>
<button>{t.common.actions.start}</button>
```

## Adding New Strings

### 1. Add to the appropriate locale file

For common strings used across the app:
```typescript
// locales/pt-BR/common.ts
export const common = {
  // ... existing strings
  newSection: {
    newString: 'New String Value',
  },
} as const;
```

For page-specific strings:
```typescript
// locales/pt-BR/[page-name].ts
export const pageName = {
  section: {
    title: 'Title',
    description: 'Description',
  },
} as const;
```

### 2. Export from the locale index

```typescript
// locales/pt-BR/index.ts
import { common } from './common';
import { pageName } from './page-name';

export const ptBR = {
  common,
  pageName, // Add your new export here
} as const;
```

### 3. Use in your component

```tsx
import { t } from '@/locales';

function MyComponent() {
  return <h1>{t.pageName.section.title}</h1>;
}
```

## Adding a New Language

To add support for a new language (e.g., English):

1. Create a new directory: `locales/en-US/`
2. Copy the structure from `pt-BR/`
3. Translate all strings in the new files
4. Add the new locale to `locales/index.ts`:

```typescript
import { ptBR } from './pt-BR';
import { enUS } from './en-US';

export const locales = {
  'pt-BR': ptBR,
  'en-US': enUS,
} as const;

// Update this to switch languages
export const currentLocale = 'en-US';
```

## Best Practices

1. **Organize by feature/page**: Keep related strings together in their own files
2. **Use nested objects**: Group related strings for better organization
3. **Use `as const`**: Ensures TypeScript provides accurate type checking
4. **Avoid hardcoded strings**: All user-facing text should come from this directory
5. **Keep keys in English**: Use  English keys even if the values are in another language
6. **Be consistent**: Follow the existing structure and naming conventions

## File Organization Guidelines

- `common.strings.ts` - App-wide strings (navigation, buttons, form labels, error messages)
- `[page-name].strings.ts` - Page-specific content (hero sections, features, descriptions)
- Keep files focused and not too large (split into multiple files if needed)

## Future Enhancements

- Add runtime locale switching
- Implement a locale context provider
- Add pluralization support
- Add date/time formatting
- Add number formatting
- Integrate with a translation management service
