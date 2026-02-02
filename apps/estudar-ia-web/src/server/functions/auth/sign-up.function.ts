import { createServerFn } from '@tanstack/react-start';
import { signUpSchema } from '@/model/auth.model';
import { AuthDbDataSource } from '@/server/data/db';

export const signUpFn = createServerFn({ method: 'POST' })
	.inputValidator(signUpSchema)
	.handler(async ({ data }) => {
		const { email, password } = data;

		const response = await AuthDbDataSource.signUp({
			email,
			password,
		});

		return response;
	});
