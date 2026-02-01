import { cva } from 'class-variance-authority';
import { SelectableCard } from '@/components/shared';
import { H3, Small } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

/**
 * Shared layout variants for exam selection card
 * Used to maintain consistency between the real component and shimmer
 */
export const examSelectionCardLayoutVariants = cva(
	'flex items-start justify-between',
	{
		variants: {},
	},
);

export const examSelectionCardContentVariants = cva('space-y-2', {
	variants: {},
});

export interface ExamSelectionCardProps {
	/**
	 * Unique identifier for the exam
	 */
	id: string;
	/**
	 * Name of the exam
	 */
	name: string;
	/**
	 * Description of the exam
	 */
	description: string;
	/**
	 * Whether this exam is currently selected
	 */
	selected: boolean;
	/**
	 * Callback when the exam is selected
	 */
	onSelect: () => void;
}

/**
 * ExamSelectionCard - Card component for exam selection
 *
 * Displays exam information with name and description.
 * Uses SelectableCard for selection behavior.
 *
 * @example
 * ```tsx
 * <ExamSelectionCard
 *   id="enem"
 *   name="ENEM"
 *   description="Exame Nacional do Ensino Médio"
 *   selected={selectedExam === 'enem'}
 *   onSelect={() => setSelectedExam('enem')}
 * />
 * ```
 */
export function ExamSelectionCard({
	name,
	description,
	selected,
	onSelect,
}: ExamSelectionCardProps) {
	return (
		<SelectableCard selected={selected} onSelect={onSelect}>
			<div className={cn(examSelectionCardLayoutVariants())}>
				<div className={cn(examSelectionCardContentVariants())}>
					<H3>{name}</H3>
					<Small className="block">{description}</Small>
				</div>
			</div>
		</SelectableCard>
	);
}
