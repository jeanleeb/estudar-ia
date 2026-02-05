import { createServerFn } from '@tanstack/react-start';
import { AuthDbDataSource } from '@/server/data/db';
import { useAppSession } from '@/server/data/session';

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
	const session = await useAppSession();
	await session.clear();

	return AuthDbDataSource.logout();
});
