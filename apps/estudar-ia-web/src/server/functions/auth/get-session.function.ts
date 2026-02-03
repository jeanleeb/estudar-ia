import { createServerFn } from '@tanstack/react-start';
import { useAppSession } from '@/server/data/session';

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
	async () => {
		const session = await useAppSession();
		return session.data;
	},
);
