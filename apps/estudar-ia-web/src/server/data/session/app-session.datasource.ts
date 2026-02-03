import { useSession } from '@tanstack/react-start/server';
import { env } from '@/env';
import type { Session } from '@/model/auth.model';

const SESSION_KEY = 'app-session';

export function useAppSession() {
	return useSession<Session>({
		name: SESSION_KEY,
		password: env.SESSION_SECRET,
		// TODO: set cookie settings for production security
		cookie: {},
	});
}
