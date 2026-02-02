import { createServerFn } from '@tanstack/react-start';
import { AuthDbDataSource } from '@/server/data/db';

export const logout = createServerFn({ method: 'POST' }).handler(() => {
	return AuthDbDataSource.logout();
});
