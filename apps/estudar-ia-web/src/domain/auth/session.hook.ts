import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Session } from '@/model/auth.model';
import { getSessionFn } from '@/server/functions/auth';
import { useUserStore } from '@/store/user.store';

export const SESSION_QUERY_KEY = ['session'] as const;

export function useSession() {
	const {
		data: session,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: SESSION_QUERY_KEY,
		queryFn: () => getSessionFn(),
		retry: 1,
		refetchOnMount: false,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
	});

	const { user: storedUser, setUser } = useUserStore();

	useEffect(() => {
		if (!isLoading) {
			const user = (session as Session | undefined)?.user;
			if (user) {
				setUser(user);
				return;
			}

			if (session !== undefined) {
				setUser(null);
			}
		}
	}, [session, isLoading, setUser]);

	// Priority: Use query data if available, otherwise fall back to stored user
	// This ensures SSR-prefetched data is used immediately on hydration
	const sessionData = session as Session | undefined;
	const user = sessionData?.user ?? (isLoading ? storedUser : null);
	const isAuthenticated = !!user;

	return {
		user,
		isAuthenticated,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
	};
}
