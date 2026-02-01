import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton - Loading placeholder component
 *
 * Displays an animated loading skeleton to indicate content is being loaded.
 * Used to create skeleton screens that match the layout of the actual content.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 */
function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-muted', className)}
			{...props}
		/>
	);
}

export { Skeleton };
