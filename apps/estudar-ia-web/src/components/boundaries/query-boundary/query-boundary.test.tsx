import { QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import '@/test/mocks';
import { translations } from '@/locales';
import { createTestQueryClient } from '@/test/utils';
import { QueryBoundary } from './index';

describe('Component - QueryBoundary', () => {
	describe('Loading State', () => {
		it('should render loadingFallback during Suspense', async () => {
			const queryClient = createTestQueryClient();

			const TestComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['test'],
					queryFn: async () => {
						await new Promise(resolve => setTimeout(resolve, 100));
						return 'data';
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

			expect(screen.getByText('Loading...')).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText('data')).toBeInTheDocument();
			});
			expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
		});
	});

	describe('Success State', () => {
		it('should render children after data loads successfully', async () => {
			const queryClient = createTestQueryClient();

			const TestComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['test'],
					queryFn: async () => 'Success data',
				});
				return <div data-testid="content">{data}</div>;
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByTestId('content')).toBeInTheDocument();
			});
			expect(screen.getByText('Success data')).toBeInTheDocument();
		});

		it('should apply fade-in animation to children', async () => {
			const queryClient = createTestQueryClient();

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test'],
					queryFn: async () => 'data',
				});
				return <div>Content</div>;
			};

			const { container } = render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Content')).toBeInTheDocument();
			});

			const wrapper = container.querySelector(
				'.fade-in-0.animate-in.duration-300',
			);
			expect(wrapper).toBeInTheDocument();
		});

		it('should apply custom className', async () => {
			const queryClient = createTestQueryClient();

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test'],
					queryFn: async () => 'data',
				});
				return <div>Content</div>;
			};

			const { container } = render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary
						loadingFallback={<div>Loading...</div>}
						className="custom-class">
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('Content')).toBeInTheDocument();
			});

			const wrapper = container.querySelector('.custom-class');
			expect(wrapper).toBeInTheDocument();
		});
	});

	describe('Error State', () => {
		const originalError = console.error;
		beforeAll(() => {
			console.error = vi.fn();
		});
		afterAll(() => {
			console.error = originalError;
		});

		it('should render default ErrorFallback when error occurs', async () => {
			const queryClient = createTestQueryClient();
			const errorMessage = 'Failed to fetch';

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test-error'],
					queryFn: () => {
						throw new Error(errorMessage);
					},
				});
				return <div>Should not render</div>;
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(
					screen.getByText(translations.common.error.title),
				).toBeInTheDocument();
			});
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
			expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
		});

		it('should render custom errorFallback when provided', async () => {
			const queryClient = createTestQueryClient();

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test-error'],
					queryFn: () => {
						throw new Error('Error');
					},
				});
				return <div>Content</div>;
			};

			const CustomError = () => (
				<div data-testid="custom-error">Custom Error UI</div>
			);

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary
						loadingFallback={<div>Loading...</div>}
						errorFallback={<CustomError />}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByTestId('custom-error')).toBeInTheDocument();
			});
			expect(
				screen.queryByText(translations.common.error.title),
			).not.toBeInTheDocument();
		});

		it('should pass errorFallbackProps to default ErrorFallback', async () => {
			const queryClient = createTestQueryClient();
			const customTitle = 'Erro Customizado';
			const customDescription = 'Descrição customizada';
			const customRetryLabel = 'Recarregar';

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test-error'],
					queryFn: () => {
						throw new Error('Error');
					},
				});
				return <div>Content</div>;
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary
						loadingFallback={<div>Loading...</div>}
						errorFallbackProps={{
							title: customTitle,
							description: customDescription,
							retryLabel: customRetryLabel,
						}}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText(customTitle)).toBeInTheDocument();
			});
			expect(screen.getByText(customDescription)).toBeInTheDocument();
			const button = screen.getByRole('button');
			expect(button).toHaveTextContent(customRetryLabel);
		});

		it('should reset error boundary when clicking retry button', async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();
			let shouldError = true;

			const TestComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['test-retry'],
					queryFn: () => {
						if (shouldError) {
							throw new Error('Temporary error');
						}
						return 'Success after retry';
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
				expect(screen.getByText('Temporary error')).toBeInTheDocument();
			});

			shouldError = false;

			const retryButton = screen.getByRole('button');
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText('Success after retry')).toBeInTheDocument();
			});
			expect(screen.queryByText('Temporary error')).not.toBeInTheDocument();
		});

		it('should call onReset callback when error is reset', async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();
			const onResetMock = vi.fn();
			let shouldError = true;

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test-callback'],
					queryFn: () => {
						if (shouldError) {
							throw new Error('Error');
						}
						return 'Success';
					},
				});
				return <div>Content</div>;
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary
						loadingFallback={<div>Loading...</div>}
						onReset={onResetMock}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(
					screen.getByText(translations.common.error.title),
				).toBeInTheDocument();
			});

			shouldError = false;
			const retryButton = screen.getByRole('button');
			await user.click(retryButton);

			expect(onResetMock).toHaveBeenCalledTimes(1);
		});

		it('should convert non-Error values into Error objects', async () => {
			const queryClient = createTestQueryClient();

			const TestComponent = () => {
				useSuspenseQuery({
					queryKey: ['test-string-error'],
					queryFn: () => {
						// Lança string ao invés de Error
						throw 'String error'; // eslint-disable-line no-throw-literal
					},
				});
				return <div>Content</div>;
			};

			render(
				<QueryClientProvider client={queryClient}>
					<QueryBoundary loadingFallback={<div>Loading...</div>}>
						<TestComponent />
					</QueryBoundary>
				</QueryClientProvider>,
			);

			await waitFor(() => {
				expect(
					screen.getByText(translations.common.error.title),
				).toBeInTheDocument();
			});
			expect(screen.getByText('String error')).toBeInTheDocument();
		});
	});

	describe('QueryErrorResetBoundary Integration', () => {
		const originalError = console.error;
		beforeAll(() => {
			console.error = vi.fn();
		});
		afterAll(() => {
			console.error = originalError;
		});

		it('should integrate with QueryErrorResetBoundary to reset queries', async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();
			let errorCount = 0;

			const TestComponent = () => {
				const { data } = useSuspenseQuery({
					queryKey: ['integration-test'],
					queryFn: () => {
						errorCount++;
						if (errorCount === 1) {
							throw new Error('First error');
						}
						return `Success (attempt ${errorCount})`;
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
				expect(screen.getByText('First error')).toBeInTheDocument();
			});
			expect(errorCount).toBe(1);

			const retryButton = screen.getByRole('button');
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText('Success (attempt 2)')).toBeInTheDocument();
			});
			expect(errorCount).toBe(2);
		});
	});
});
