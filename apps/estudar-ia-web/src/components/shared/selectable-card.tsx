import type React from 'react';
import { Card } from '@/components/ui/card';
import { CheckIcon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface SelectableCardProps {
	/**
	 * Whether the card is currently selected
	 */
	selected: boolean;
	/**
	 * Callback when the card is clicked
	 */
	onSelect: () => void;
	/**
	 * Content to render inside the card
	 */
	children: React.ReactNode;
	/**
	 * Optional indicator to show when selected (e.g., checkmark icon)
	 */
	selectedIndicator?: React.ReactNode;
	/**
	 * Additional CSS classes for the card
	 */
	className?: string;
	/**
	 * Disable the card interaction
	 */
	disabled?: boolean;
}

/**
 * SelectableCard - Generic selectable card component
 *
 * Provides a clickable card with visual feedback for selected state.
 * Useful for selection interfaces like exam selection, subject selection, etc.
 *
 * @example
 * ```tsx
 * <SelectableCard
 *   selected={isSelected}
 *   onSelect={() => setSelected(true)}
 *   selectedIndicator={<CheckIcon />}
 * >
 *   <H3>Option 1</H3>
 *   <Small>Description</Small>
 * </SelectableCard>
 * ```
 */
export function SelectableCard({
	selected,
	onSelect,
	children,
	selectedIndicator,
	className,
	disabled = false,
}: SelectableCardProps) {
	const defaultIndicator = (
		<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
			<CheckIcon size="sm" className="text-primary-foreground" />
		</div>
	);

	return (
		<Card
			className={cn(
				'cursor-pointer border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]',
				selected
					? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
					: 'border-border bg-card hover:border-primary/50 hover:shadow-lg',
				disabled &&
					'cursor-not-allowed opacity-50 hover:translate-y-0 hover:border-border hover:shadow-none active:scale-100',
				className,
			)}
			onClick={disabled ? undefined : onSelect}>
			<div className="relative">
				{children}
				{selected && (
					<div className="absolute top-0 right-0">
						{selectedIndicator ?? defaultIndicator}
					</div>
				)}
			</div>
		</Card>
	);
}
