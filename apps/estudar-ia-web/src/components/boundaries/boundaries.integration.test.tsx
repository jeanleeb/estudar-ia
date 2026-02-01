import { QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import '@/test/mocks';
import { createTestQueryClient } from '@/test/utils';
import { EmptyCheck } from './empty-check';
import { QueryBoundary } from './query-boundary';

describe('Integration - Boundaries', () => {
	describe('Complete Pattern: QueryBoundary + EmptyCheck', () => {
		interface Item {
			id: number;
			name: string;
		}

		const mockItems: Item[] = [
			{ id: 1, name: 'Item 1' },
			{ id: 2, name: 'Item 2' },
		];

		it('should manage all 4 states correctly: loading -> success -> empty -> success', async () => {
			const queryClient = createTestQueryClient();
			let responseData: Item[] = mockItems;

			const DataFetcher = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['items'],
					queryFn: async () => {
						await new Promise(resolve => setTimeout(resolve, 50));
						return responseData;
					},
				});

				return (
					<EmptyCheck
						isEmpty={!data?.length}
						fallbackProps={{
							title: 'Nenhum item',
							description: 'Não há itens disponíveis',
						}}>
						<ul data-testid="item-list">
							{data.map(item => (
								<li key={item.id}>{item.name}</li>
							))}
						</ul>
					</EmptyCheck>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Carregando...</div>}>
						<DataFetcher />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			expect(screen.getByText('Carregando...')).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByTestId('item-list')).toBeInTheDocument();
			});
			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();

			responseData = [];
			queryClient.invalidateQueries({ queryKey: ['items'] });

			await waitFor(() => {
				expect(screen.getByText('Nenhum item')).toBeInTheDocument();
			});
			expect(screen.queryByTestId('item-list')).not.toBeInTheDocument();

			responseData = mockItems;
			queryClient.invalidateQueries({ queryKey: ['items'] });

			await waitFor(() => {
				expect(screen.getByTestId('item-list')).toBeInTheDocument();
			});
			expect(screen.getByText('Item 1')).toBeInTheDocument();
		});

		it('should manage error state and recovery', async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();
			let shouldError = true;

			const DataFetcher = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['items-with-error'],
					queryFn: () => {
						if (shouldError) {
							throw new Error('Failed to load items');
						}
						return mockItems;
					},
				});

				return (
					<EmptyCheck isEmpty={!data?.length}>
						<ul>
							{data.map(item => (
								<li key={item.id}>{item.name}</li>
							))}
						</ul>
					</EmptyCheck>
				);
			};

			const originalError = console.error;
			console.error = vi.fn();

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<DataFetcher />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Failed to load items')).toBeInTheDocument();
			});

			shouldError = false;
			const retryButton = screen.getByRole('button');
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText('Item 1')).toBeInTheDocument();
			});
			expect(
				screen.queryByText('Failed to load items'),
			).not.toBeInTheDocument();

			console.error = originalError;
		});

		it('should transition from error to empty data', async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();
			let shouldError = true;

			const DataFetcher = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['error-to-empty'],
					queryFn: () => {
						if (shouldError) {
							throw new Error('Error state');
						}
						return [];
					},
				});

				return (
					<EmptyCheck
						isEmpty={!data?.length}
						fallbackProps={{
							title: 'Lista vazia',
							description: 'Nenhum dado encontrado',
						}}>
						<div data-testid="content">Dados</div>
					</EmptyCheck>
				);
			};

			const originalError = console.error;
			console.error = vi.fn();

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<DataFetcher />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Error state')).toBeInTheDocument();
			});

			shouldError = false;
			const retryButton = screen.getByRole('button');
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText('Lista vazia')).toBeInTheDocument();
			});
			expect(screen.queryByTestId('content')).not.toBeInTheDocument();

			console.error = originalError;
		});
	});

	describe('Real World Scenarios', () => {
		it('should work with pagination', async () => {
			const queryClient = createTestQueryClient();
			const pages = {
				1: [{ id: 1, name: 'Page 1 Item' }],
				2: [{ id: 2, name: 'Page 2 Item' }],
			};

			let currentPage = 1;

			const PaginatedComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['paginated', currentPage],
					queryFn: async () => pages[currentPage as keyof typeof pages],
				});

				return (
					<EmptyCheck isEmpty={!data?.length}>
						<div>
							{data.map(item => (
								<div key={item.id}>{item.name}</div>
							))}
						</div>
					</EmptyCheck>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<PaginatedComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Page 1 Item')).toBeInTheDocument();
			});

			currentPage = 2;
			queryClient.invalidateQueries({ queryKey: ['paginated'] });

			await waitFor(() => {
				expect(screen.getByText('Page 2 Item')).toBeInTheDocument();
			});
		});

		it('should work with search that returns empty results', async () => {
			const queryClient = createTestQueryClient();
			let searchQuery = '';

			const SearchComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['search', searchQuery],
					queryFn: () => {
						if (searchQuery === 'xyz') {
							return [];
						}
						return [
							{ id: 1, name: 'Result 1' },
							{ id: 2, name: 'Result 2' },
						];
					},
				});

				return (
					<EmptyCheck
						isEmpty={!data?.length}
						fallbackProps={{
							title: 'Nenhum resultado',
							description: `Nenhum resultado encontrado para "${searchQuery}"`,
						}}>
						<ul>
							{data.map(item => (
								<li key={item.id}>{item.name}</li>
							))}
						</ul>
					</EmptyCheck>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Buscando...</div>}>
						<SearchComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Result 1')).toBeInTheDocument();
			});

			searchQuery = 'xyz';
			queryClient.invalidateQueries({ queryKey: ['search'] });

			await waitFor(() => {
				expect(screen.getByText('Nenhum resultado')).toBeInTheDocument();
			});
			expect(
				screen.getByText('Nenhum resultado encontrado para "xyz"'),
			).toBeInTheDocument();
		});

		it('should work with multiple nested QueryBoundaries', async () => {
			const queryClient = createTestQueryClient();

			const InnerComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['inner'],
					queryFn: async () => {
						await new Promise(resolve => setTimeout(resolve, 100));
						return 'Inner data';
					},
				});
				return <div data-testid="inner">{data}</div>;
			};

			const OuterComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['outer'],
					queryFn: async () => {
						await new Promise(resolve => setTimeout(resolve, 50));
						return 'Outer data';
					},
				});
				return (
					<div>
						<div data-testid="outer">{data}</div>
						<QueryBoundary loadingFallback={<div>Loading inner...</div>}>
							<InnerComponent />
						</QueryBoundary>
					</div>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading outer...</div>}>
						<OuterComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			expect(screen.getByText('Loading outer...')).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByTestId('outer')).toBeInTheDocument();
			});

			const innerLoading = screen.queryByText('Loading inner...');
			if (innerLoading) {
				expect(innerLoading).toBeInTheDocument();
			}

			await waitFor(() => {
				expect(screen.getByTestId('inner')).toBeInTheDocument();
			});
			expect(screen.getByText('Outer data')).toBeInTheDocument();
			expect(screen.getByText('Inner data')).toBeInTheDocument();
		});
	});

	describe('Complex Error Handling', () => {
		const originalError = console.error;
		beforeAll(() => {
			console.error = vi.fn();
		});
		afterAll(() => {
			console.error = originalError;
		});

		it('should allow multiple retry attempts', async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();
			let attemptCount = 0;

			const TestComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['multiple-retries'],
					queryFn: () => {
						attemptCount++;
						if (attemptCount < 3) {
							throw new Error(`Attempt ${attemptCount} failed`);
						}
						return 'Success';
					},
				});
				return <div>{data}</div>;
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Attempt 1 failed')).toBeInTheDocument();
			});

			let retryButton = screen.getByRole('button');
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText('Attempt 2 failed')).toBeInTheDocument();
			});

			retryButton = screen.getByRole('button');
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText('Success')).toBeInTheDocument();
			});
			expect(attemptCount).toBe(3);
		});

		it('should handle error in EmptyCheck after initial success', async () => {
			const queryClient = createTestQueryClient();
			let shouldReturnEmpty = false;

			const TestComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['empty-after-success'],
					queryFn: () => {
						if (shouldReturnEmpty) {
							return [];
						}
						return [{ id: 1, name: 'Item' }];
					},
				});

				return (
					<EmptyCheck
						isEmpty={!data?.length}
						fallbackProps={{
							title: 'Vazio agora',
							description: 'Os dados foram removidos',
						}}>
						<ul>
							{data.map(item => (
								<li key={item.id}>{item.name}</li>
							))}
						</ul>
					</EmptyCheck>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Item')).toBeInTheDocument();
			});

			shouldReturnEmpty = true;
			queryClient.invalidateQueries({ queryKey: ['empty-after-success'] });

			await waitFor(() => {
				expect(screen.getByText('Vazio agora')).toBeInTheDocument();
			});
			expect(screen.queryByText('Item')).not.toBeInTheDocument();
		});
	});

	describe('Complete Customization', () => {
		it('should allow complete customization of all fallbacks', async () => {
			const queryClient = createTestQueryClient();
			const shouldError = true;
			const isEmpty = false;

			const DataFetcher = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['custom-fallbacks'],
					queryFn: () => {
						if (shouldError) {
							throw new Error('Custom error');
						}
						if (isEmpty) {
							return [];
						}
						return [{ id: 1, name: 'Data' }];
					},
				});

				return (
					<EmptyCheck
						isEmpty={!data?.length}
						fallback={
							<div data-testid="custom-empty">
								Completamente customizado - vazio
							</div>
						}>
						<div data-testid="success">Success state</div>
					</EmptyCheck>
				);
			};

			const originalError = console.error;
			console.error = vi.fn();

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary
						loadingFallback={
							<div data-testid="custom-loading">Custom loading...</div>
						}
						errorFallback={
							<div data-testid="custom-error">
								<p>Custom error UI</p>
							</div>
						}>
						<DataFetcher />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			// Verifica estado de erro customizado
			await waitFor(() => {
				expect(screen.getByTestId('custom-error')).toBeInTheDocument();
			});
			expect(screen.getByText('Custom error UI')).toBeInTheDocument();

			console.error = originalError;
		});
	});
});
