import { createServerFn } from '@tanstack/react-start';
import { signUpSchema } from '@/model/auth.validation';
import { AuthDbDataSource } from '@/server/data/db';
import { useAppSession } from '@/server/data/session';

export const signUpFn = createServerFn({ method: 'POST' })
	.inputValidator(signUpSchema)
	.handler(async ({ data }) => {
		const { email, password, name } = data;

		const response = await AuthDbDataSource.signUp({
			email,
			password,
			options: {
				data: {
					first_name: name.split(' ')[0],
					last_name: name.split(' ').slice(1).join(' '),
				},
			},
		});

		if (!response.user) {
			throw new Error('Failed to create user account');
		}

		const session = await useAppSession();
		await session.update({
			user: {
				id: response.user.id,
				email: response.user.email,
				firstName: response.user.user_metadata.first_name,
				lastName: response.user.user_metadata.last_name,
			},
		});

		return { success: true };
	});
