import { ptBR, type Translations } from './pt-BR';

// Default locale
export const defaultLocale = 'pt-BR';

// Available locales
export const locales = {
	'pt-BR': ptBR,
} as const;

// Current locale (can be made dynamic in the future)
export const currentLocale = defaultLocale;

// Main translations object
export const translations: Translations = locales[currentLocale];

// Export types
export type { Translations };
export type Locale = keyof typeof locales;
