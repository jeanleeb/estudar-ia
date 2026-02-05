import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { AppHeader } from '@/components/shared';
import { ThemeProvider } from '@/core/theme';
import { SESSION_QUERY_KEY } from '@/hooks';
import { getSessionFn } from '@/server/functions/auth';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import AiDevtools from '../lib/ai-devtools';
import appCss from '../styles.css?url';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'EstudarIA',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),

	// Ensure session data is fresh before any route loads
	beforeLoad: async ({ context }) => {
		await context.queryClient.ensureQueryData({
			queryKey: SESSION_QUERY_KEY,
			queryFn: () => getSessionFn(),
		});
	},

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen bg-background">
				<ThemeProvider>
					<AppHeader />
					{children}
					<TanStackDevtools
						config={{
							position: 'bottom-right',
						}}
						plugins={[
							{
								name: 'Tanstack Router',
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
							AiDevtools,
						]}
					/>
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	);
}
