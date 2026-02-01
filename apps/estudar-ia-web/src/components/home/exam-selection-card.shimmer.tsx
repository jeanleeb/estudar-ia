import { Card } from '@/components/ui/card';
import { H3Shimmer, SmallShimmer } from '@/components/ui/typography.shimmer';
import { cn } from '@/lib/utils';
import {
	examSelectionCardContentVariants,
	examSelectionCardLayoutVariants,
} from './exam-selection-card';

export interface ExamSelectionCardShimmerProps {
	/**
	 * Additional CSS classes for the card
	 */
	className?: string;
}

export function ExamSelectionCardShimmer({
	className,
}: ExamSelectionCardShimmerProps) {
	return (
		<Card className={cn('border-2 border-border bg-card', className)}>
			<div className={cn(examSelectionCardLayoutVariants())}>
				<div className={cn(examSelectionCardContentVariants(), 'w-full')}>
					<H3Shimmer width="3/4" />
					<SmallShimmer width="full" />
				</div>
			</div>
		</Card>
	);
}
