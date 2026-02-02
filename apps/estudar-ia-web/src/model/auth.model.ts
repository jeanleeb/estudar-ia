import z from 'zod';
import { translations } from '@/locales';

const strings = translations.validation.auth;

export const loginSchema = z.object({
	email: z
		.email({ message: strings.email.invalid })
		.min(1, { message: strings.email.required }),
	password: z.string().min(1, { message: strings.password.required }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = loginSchema.extend({});

export type SignUpInput = z.infer<typeof signUpSchema>;
