'use client';

import type * as React from 'react';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { SmileIcon } from '@/components/ui/icon';
import { t } from '@/locales';

// ============================================================================
// Types
// ============================================================================

export interface EmptyFallbackProps {
	/** Custom title for the empty state */
	title?: string;

	/** Custom description for the empty state */
	description?: string;

	/** Custom icon to display */
	icon?: React.ReactNode;

	/** Optional children to render custom content */
	children?: React.ReactNode;
}

// ============================================================================
// Default Icon
// ============================================================================

function DefaultEmptyIcon() {
	return <SmileIcon size="md" />;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * EmptyFallback - Default empty state UI component
 *
 * Displays a user-friendly empty state message.
 * Can be used standalone or as a fallback in EmptyCheck.
 *
 * @example
 * ```tsx
 * <EmptyFallback
 *   title="Nenhum item encontrado"
 *   description="Não há itens disponíveis no momento."
 * />
 * ```
 *
 * @example With custom icon
 * ```tsx
 * <EmptyFallback
 *   title="Sem resultados"
 *   description="Tente outra busca."
 *   icon={<SearchIcon />}
 * />
 * ```
 *
 * @example With custom content
 * ```tsx
 * <EmptyFallback>
 *   <Button onClick={handleCreate}>Criar novo item</Button>
 * </EmptyFallback>
 * ```
 */
export function EmptyFallback({
	title,
	description,
	icon,
	children,
}: EmptyFallbackProps) {
	const emptyTitle = title || t.common.empty.title;
	const emptyDescription = description || t.common.empty.description;

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">{icon || <DefaultEmptyIcon />}</EmptyMedia>
				<EmptyTitle>{emptyTitle}</EmptyTitle>
				<EmptyDescription>{emptyDescription}</EmptyDescription>
			</EmptyHeader>
			{children && <div className="mt-4">{children}</div>}
		</Empty>
	);
}
