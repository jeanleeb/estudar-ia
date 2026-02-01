/**
 * Boundaries - Async State Management Components
 *
 * This module exports components for managing async states in React applications:
 * - QueryBoundary: Handles loading and error states using Suspense + Error Boundary
 * - EmptyCheck: Handles empty data states
 * - ErrorFallback: Default error UI component
 * - EmptyFallback: Default empty state UI component
 *
 * These components work together with TanStack Query's `useSuspenseQuery`
 * to provide a complete, declarative async state management solution.
 *
 * @example Complete usage pattern
 * ```tsx
 * import { QueryBoundary, EmptyCheck } from '@/components/boundaries';
 *
 * function MyPage() {
 *   return (
 *     <QueryBoundary loadingFallback={<Skeleton />}>
 *       <DataFetcher />
 *     </QueryBoundary>
 *   );
 * }
 *
 * function DataFetcher() {
 *   const { data } = useSuspenseQuery({
 *     queryKey: ['items'],
 *     queryFn: fetchItems,
 *   });
 *
 *   return (
 *     <EmptyCheck isEmpty={!data?.length}>
 *       <ItemList items={data} />
 *     </EmptyCheck>
 *   );
 * }
 * ```
 */

// Empty Check exports
export {
	EmptyCheck,
	type EmptyCheckProps,
	EmptyFallback,
	type EmptyFallbackProps,
} from './empty-check';
// Query Boundary exports
export {
	ErrorFallback,
	type ErrorFallbackProps,
	QueryBoundary,
	type QueryBoundaryProps,
} from './query-boundary';
