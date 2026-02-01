import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type * as React from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { cn } from '@/lib/utils';
import { ErrorFallback, type ErrorFallbackProps } from './error-fallback';

// ============================================================================
// Types
// ============================================================================

export interface QueryBoundaryProps {
	/** Children to render when data is loaded successfully */
	children: React.ReactNode;

	/** Loading fallback (skeleton/spinner) */
	loadingFallback: React.ReactNode;

	/** Custom error fallback component */
	errorFallback?: React.ReactNode;

	/** Props to pass to the default ErrorFallback component */
	errorFallbackProps?: Partial<Omit<ErrorFallbackProps, 'error' | 'onReset'>>;

	/** Optional className for container */
	className?: string;

	/** Callback when error boundary resets */
	onReset?: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * QueryBoundary - Declarative async state management boundary
 *
 * Combines React Suspense and Error Boundary to handle:
 * - **Loading states** (via Suspense)
 * - **Error states** (via Error Boundary)
 * - **Automatic retry** with TanStack Query
 *
 * Works seamlessly with TanStack Query's `useSuspenseQuery`.
 *
 * ## Basic Usage
 *
 * @example
 * ```tsx
 * <QueryBoundary loadingFallback={<Skeleton />}>
 *   <DataComponent />
 * </QueryBoundary>
 * ```
 *
 * ## With Custom Error Messages
 *
 * @example
 * ```tsx
 * <QueryBoundary
 *   loadingFallback={<ExamSelectionShimmer />}
 *   errorFallbackProps={{
 *     title: 'Erro ao carregar exames',
 *     description: 'Não foi possível carregar a lista de exames.',
 *     retryLabel: 'Tentar novamente',
 *   }}
 * >
 *   <ExamsListContent />
 * </QueryBoundary>
 * ```
 *
 * ## With Fully Custom Error Fallback
 *
 * @example
 * ```tsx
 * <QueryBoundary
 *   loadingFallback={<Skeleton />}
 *   errorFallback={<CustomErrorComponent />}
 * >
 *   <DataComponent />
 * </QueryBoundary>
 * ```
 *
 * ## Usage Pattern with EmptyCheck
 *
 * @example
 * ```tsx
 * <QueryBoundary loadingFallback={<Skeleton />}>
 *   <DataFetcher />
 * </QueryBoundary>
 *
 * function DataFetcher() {
 *   const { data } = useSuspenseQuery({
 *     queryKey: ['items'],
 *     queryFn: fetchItems,
 *   });
 *
 *   return (
 *     <EmptyCheck isEmpty={!data?.length}>
 *       <List items={data} />
 *     </EmptyCheck>
 *   );
 * }
 * ```
 */
export function QueryBoundary({
	children,
	loadingFallback,
	errorFallback,
	errorFallbackProps,
	className,
	onReset,
}: QueryBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={() => {
						reset();
						onReset?.();
					}}
					fallbackRender={({ error, resetErrorBoundary }) => {
						// Ensure error is an Error object
						const errorObj =
							error instanceof Error ? error : new Error(String(error));

						// Use custom error fallback if provided
						if (errorFallback) {
							return <>{errorFallback}</>;
						}

						// Use default ErrorFallback with custom props
						return (
							<ErrorFallback
								error={errorObj}
								onReset={resetErrorBoundary}
								{...errorFallbackProps}
							/>
						);
					}}>
					<Suspense fallback={loadingFallback}>
						<div className={cn('fade-in-0 animate-in duration-300', className)}>
							{children}
						</div>
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

// ============================================================================
// Re-export related components
// ============================================================================

export type { ErrorFallbackProps } from './error-fallback';
export { ErrorFallback } from './error-fallback';
