import type React from 'react';
import { Card } from '@/components/ui/card';
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
 *   <h3>Option 1</h3>
 *   <p>Description</p>
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
			<svg
				className="h-4 w-4 text-primary-foreground"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<title>Selected</title>
				<path d="M5 13l4 4L19 7" />
			</svg>
		</div>
	);

	return (
		<Card
			className={cn(
				'cursor-pointer border-2 transition-all hover:shadow-lg',
				selected
					? 'border-primary bg-primary/5'
					: 'border-border bg-card hover:border-primary/50',
				disabled && 'cursor-not-allowed opacity-50',
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
