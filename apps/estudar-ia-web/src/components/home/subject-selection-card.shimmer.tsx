import { Card } from '@/components/ui/card';
import { H3Shimmer } from '@/components/ui/typography.shimmer';
import { cn } from '@/lib/utils';

export interface SubjectSelectionCardShimmerProps {
	/**
	 * Additional CSS classes for the card
	 */
	className?: string;
}

/**
 * SubjectSelectionCardShimmer - Loading skeleton for SubjectSelectionCard
 *
 * Displays a shimmer effect while subject data is loading.
 * Maintains the same centered layout as the real component.
 *
 * @example
 * ```tsx
 * <SubjectSelectionCardShimmer />
 * ```
 */
export function SubjectSelectionCardShimmer({
	className,
}: SubjectSelectionCardShimmerProps) {
	return (
		<Card className={cn('border-2 border-border bg-card', className)}>
			<div className="flex flex-col items-center justify-center text-center">
				{/* Icon shimmer - circular placeholder for emoji */}
				<div className="mb-3 h-12 w-12 animate-pulse rounded-full bg-muted" />
				{/* Name shimmer */}
				<H3Shimmer width="2/3" />
			</div>
		</Card>
	);
}
