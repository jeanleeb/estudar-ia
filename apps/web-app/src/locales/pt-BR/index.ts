import { common } from './common.strings';
import { home } from './home.strings';

export const ptBR = {
	common,
	home,
} as const;

export type Translations = typeof ptBR;
