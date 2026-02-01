import { common } from './common.strings';
import { home } from './home.strings';
import { login } from './login.strings';

export const ptBR = {
	common,
	home,
	login,
} as const;

export type Translations = typeof ptBR;
