import type * as React from 'react';
import { EmptyFallback, type EmptyFallbackProps } from './empty-fallback';

// ============================================================================
// Types
// ============================================================================

export interface EmptyCheckProps {
	/** Whether the data is empty */
	isEmpty: boolean;

	/** Children to render when data is not empty */
	children: React.ReactNode;

	/** Custom fallback to render when data is empty */
	fallback?: React.ReactNode;

	/** Props to pass to the default EmptyFallback component */
	fallbackProps?: EmptyFallbackProps;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * EmptyCheck - Declarative empty state handler
 *
 * Conditionally renders children or an empty state fallback based on data presence.
 * Works together with QueryBoundary for complete async state management.
 *
 * ## Basic Usage
 *
 * @example
 * ```tsx
 * <EmptyCheck isEmpty={!data?.length}>
 *   <List items={data} />
 * </EmptyCheck>
 * ```
 *
 * ## With Custom Messages
 *
 * @example
 * ```tsx
 * <EmptyCheck
 *   isEmpty={!items?.length}
 *   fallbackProps={{
 *     title: 'Nenhum item encontrado',
 *     description: 'Não há itens disponíveis no momento.',
 *   }}
 * >
 *   <ItemList items={items} />
 * </EmptyCheck>
 * ```
 *
 * ## With Custom Fallback
 *
 * @example
 * ```tsx
 * <EmptyCheck
 *   isEmpty={!data?.length}
 *   fallback={<CustomEmptyState />}
 * >
 *   <DataDisplay data={data} />
 * </EmptyCheck>
 * ```
 *
 * ## With Custom Fallback and Actions
 *
 * @example
 * ```tsx
 * <EmptyCheck
 *   isEmpty={!data?.length}
 *   fallback={
 *     <EmptyFallback
 *       title="Sem dados"
 *       description="Comece adicionando um novo item."
 *     >
 *       <Button onClick={handleCreate}>Criar Item</Button>
 *     </EmptyFallback>
 *   }
 * >
 *   <DataDisplay data={data} />
 * </EmptyCheck>
 * ```
 *
 * ## Complete Pattern with QueryBoundary
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
 *     <EmptyCheck
 *       isEmpty={!data?.length}
 *       fallbackProps={{
 *         title: 'Nenhum item',
 *         description: 'Adicione seu primeiro item.',
 *       }}
 *     >
 *       <ItemList items={data} />
 *     </EmptyCheck>
 *   );
 * }
 * ```
 */
export function EmptyCheck({
	isEmpty,
	children,
	fallback,
	fallbackProps,
}: EmptyCheckProps) {
	if (isEmpty) {
		// Use custom fallback if provided
		if (fallback) {
			return <>{fallback}</>;
		}

		// Use default EmptyFallback with custom props
		return <EmptyFallback {...fallbackProps} />;
	}

	return <>{children}</>;
}
