import { createServerFn } from '@tanstack/react-start';
import { signUpSchema } from '@/model/auth.validation';
import { AuthDbDataSource } from '@/server/data/db';
import { useAppSession } from '@/server/data/session';
import { buildAuthUserMetadata, mapAuthUserToSessionUser } from './user.mapper';

export const signUpFn = createServerFn({ method: 'POST' })
	.inputValidator(signUpSchema)
	.handler(async ({ data }) => {
		const { email, password, name } = data;

		const response = await AuthDbDataSource.signUp({
			email,
			password,
			options: {
				data: buildAuthUserMetadata(name),
			},
		});

		if (!response.user) {
			throw new Error('Failed to create user account');
		}

		const session = await useAppSession();
		await session.update({
			user: mapAuthUserToSessionUser(response.user),
		});

		return { success: true };
	});
