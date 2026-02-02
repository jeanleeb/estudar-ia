import { common } from './common.strings';
import { home } from './home.strings';
import { login } from './login.strings';
import { signUp } from './sign-up.strings';
import { validation } from './validation.strings';

export const ptBR = {
	common,
	home,
	login,
	signUp,
	validation,
} as const;

export type Translations = typeof ptBR;
