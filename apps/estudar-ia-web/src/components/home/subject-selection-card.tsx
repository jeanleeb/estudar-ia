import { SelectableCard } from '@/components/shared';
import { H3 } from '@/components/ui/typography';

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
			<div className="mb-3 text-4xl">{icon}</div>
			<H3 className="text-center">{name}</H3>
		</SelectableCard>
	);
}
