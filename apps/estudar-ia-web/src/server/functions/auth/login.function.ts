import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { type LoginInput, loginSchema } from '@/model/auth.validation';
import { AuthDbDataSource } from '@/server/data/db';
import { useAppSession } from '@/server/data/session';

export const loginFn = createServerFn({ method: 'POST' })
	.inputValidator(loginSchema)
	.handler(async ({ data }) => {
		const { email, password }: LoginInput = data;

		const response = await AuthDbDataSource.login({
			email,
			password,
		});

		const session = await useAppSession();
		await session.update({
			user: {
				id: response.user.id,
				email: response.user.email,
				firstName: response.user.user_metadata.first_name,
				lastName: response.user.user_metadata.last_name,
			},
		});

		throw redirect({ to: '/' });
	});
