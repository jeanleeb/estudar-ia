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

// Password validation regex patterns
// Symbol regex accepts all common keyboard symbols that Supabase Auth accepts
// This includes: ! @ # $ % ^ & * ( ) _ + - = [ ] { } ; : ' " \ | , . < > / ? ` ~
const passwordRegex = {
	minLength: /.{6,}/,
	uppercase: /[A-Z]/,
	lowercase: /[a-z]/,
	number: /[0-9]/,
	symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
};

export const signUpSchema = z
	.object({
		name: z
			.string()
			.min(1, { message: strings.name.required })
			.min(2, { message: strings.name.minLength }),
		email: z
			.email({ message: strings.email.invalid })
			.min(1, { message: strings.email.required }),
		password: z
			.string()
			.min(1, { message: strings.password.required })
			.min(6, { message: strings.password.minLength })
			.regex(passwordRegex.uppercase, { message: strings.password.uppercase })
			.regex(passwordRegex.lowercase, { message: strings.password.lowercase })
			.regex(passwordRegex.number, { message: strings.password.number })
			.regex(passwordRegex.symbol, { message: strings.password.symbol }),
		confirmPassword: z
			.string()
			.min(1, { message: strings.confirmPassword.required }),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: strings.confirmPassword.mismatch,
		path: ['confirmPassword'],
	});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const validatePasswordRule = (
	password: string,
	rule: keyof typeof passwordRegex,
): boolean => {
	return passwordRegex[rule].test(password);
};
