import type * as React from 'react';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { AlertCircleIcon, RefreshCwIcon } from '@/components/ui/icon';
import { t } from '@/locales';

// ============================================================================
// Types
// ============================================================================

export interface ErrorFallbackProps {
	/** The error object */
	error: Error;

	/** Function to reset the error boundary and retry */
	onReset: () => void;

	/** Custom title for the error message */
	title?: string;

	/** Custom description for the error message */
	description?: string;

	/** Custom label for the retry button */
	retryLabel?: string;

	/** Optional children to render custom content */
	children?: React.ReactNode;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ErrorFallback - Default error UI component
 *
 * Displays a user-friendly error message with retry functionality.
 * Can be used standalone or as a fallback in QueryBoundary.
 *
 * @example
 * ```tsx
 * <ErrorFallback
 *   error={new Error('Failed to load')}
 *   onReset={() => refetch()}
 *   title="Erro ao carregar dados"
 *   description="Não foi possível carregar as informações."
 * />
 * ```
 *
 * @example With custom content
 * ```tsx
 * <ErrorFallback error={error} onReset={reset}>
 *   <p>Custom error details here</p>
 * </ErrorFallback>
 * ```
 */
export function ErrorFallback({
	error,
	onReset,
	title,
	description,
	retryLabel,
	children,
}: ErrorFallbackProps) {
	const errorTitle = title || t.common.error.title;
	const errorDescription =
		description || error.message || t.common.error.description;
	const retryButtonLabel = retryLabel || t.common.error.retryButton;

	return (
		<Empty className="border border-destructive/20 bg-destructive/5">
			<EmptyHeader>
				<EmptyMedia
					variant="icon"
					className="bg-destructive/10 text-destructive">
					<AlertCircleIcon size="md" />
				</EmptyMedia>
				<EmptyTitle className="text-destructive">{errorTitle}</EmptyTitle>
				<EmptyDescription>{errorDescription}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				{children || (
					<Button onClick={onReset} variant="outline" className="gap-2">
						<RefreshCwIcon size="sm" />
						{retryButtonLabel}
					</Button>
				)}
			</EmptyContent>
		</Empty>
	);
}
