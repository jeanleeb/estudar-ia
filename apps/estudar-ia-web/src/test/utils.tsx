import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

/**
 * Cria um QueryClient configurado para testes
 * - Sem retries para evitar timeouts
 * - Sem cache para isolamento entre testes
 */
export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: Number.POSITIVE_INFINITY,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

interface WrapperProps {
	children: ReactNode;
}

/**
 * Renderiza componente com QueryClientProvider
 */
export function renderWithQueryClient(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) {
	const queryClient = createTestQueryClient();

	function Wrapper({ children }: WrapperProps) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	}

	return {
		...render(ui, { wrapper: Wrapper, ...options }),
		queryClient,
	};
}
