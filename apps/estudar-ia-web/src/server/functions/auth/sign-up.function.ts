import { createServerFn } from '@tanstack/react-start';
import { signUpSchema } from '@/model/auth.validation';
import { AuthDbDataSource } from '@/server/data/db';

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

		return response;
	});
