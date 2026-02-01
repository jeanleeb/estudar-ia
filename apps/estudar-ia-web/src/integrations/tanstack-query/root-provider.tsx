import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const DEFAULT_RETRY_TIMES = 2;
const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME_MS = 10 * 60 * 1000; // 10 minutes

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: DEFAULT_RETRY_TIMES,
				staleTime: DEFAULT_STALE_TIME_MS,
				gcTime: DEFAULT_CACHE_TIME_MS,
				throwOnError: true,
			},
		},
	});
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
