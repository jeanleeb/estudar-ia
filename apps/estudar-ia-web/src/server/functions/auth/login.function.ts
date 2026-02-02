import { createServerFn } from '@tanstack/react-start';
import { type LoginInput, loginSchema } from '@/model/auth.model';
import { AuthDbDataSource } from '@/server/data/db';

export const loginFn = createServerFn({ method: 'POST' })
	.inputValidator(loginSchema)
	.handler(async ({ data }) => {
		const { email, password }: LoginInput = data;

		const response = await AuthDbDataSource.login({
			email,
			password,
		});

		return response;
	});
