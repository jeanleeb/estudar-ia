import { createServerFn } from '@tanstack/react-start';
import { type LoginInput, loginSchema } from '@/model/auth.validation';
import { AuthDbDataSource } from '@/server/data/db';
import { useAppSession } from '@/server/data/session';
import { mapAuthUserToSessionUser } from './user.mapper';

export const loginFn = createServerFn({ method: 'POST' })
	.inputValidator(loginSchema)
	.handler(async ({ data }) => {
		const { email, password }: LoginInput = data;

		const response = await AuthDbDataSource.login({
			email,
			password,
		});

		if (!response.user) {
			throw new Error('Failed to sign in user');
		}

		const session = await useAppSession();
		await session.update({
			user: mapAuthUserToSessionUser(response.user),
		});

		return { success: true };
	});
