import { SelectableCard } from '@/components/shared';
import { H3 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface SubjectSelectionCardProps {
	/**
	 * Unique identifier for the subject
	 */
	id: string;
	/**
	 * Name of the subject
	 */
	name: string;
	/**
	 * Icon/emoji representing the subject
	 */
	icon: string;
	/**
	 * Whether this subject is currently selected
	 */
	selected: boolean;
	/**
	 * Callback when the subject is selected/deselected
	 */
	onToggle: () => void;
}

/**
 * SubjectSelectionCard - Card component for subject selection
 *
 * Displays subject information with icon and name.
 * Uses SelectableCard for selection behavior with a centered layout.
 *
 * @example
 * ```tsx
 * <SubjectSelectionCard
 *   id="physics"
 *   name="Física"
 *   icon="⚛️"
 *   selected={selectedSubjects.includes('physics')}
 *   onToggle={() => toggleSubject('physics')}
 * />
 * ```
 */
export function SubjectSelectionCard({
	name,
	icon,
	selected,
	onToggle,
}: SubjectSelectionCardProps) {
	return (
		<SelectableCard
			selected={selected}
			onSelect={onToggle}
			className="text-center">
			<div
				className={cn(
					'mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200',
					selected ? 'bg-primary/10' : 'bg-muted',
				)}>
				<span className="text-3xl">{icon}</span>
			</div>
			<H3 className="text-center">{name}</H3>
		</SelectableCard>
	);
}
