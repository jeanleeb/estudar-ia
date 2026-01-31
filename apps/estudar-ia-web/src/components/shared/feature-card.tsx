import type React from 'react';
import { H3, Small } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
	/**
	 * Icon to display at the top of the card
	 */
	icon: React.ReactNode;
	/**
	 * Background color class for the icon container
	 * @default 'bg-primary/10'
	 */
	iconBgColor?: string;
	/**
	 * Title of the feature
	 */
	title: string;
	/**
	 * Description of the feature
	 */
	description: string;
	/**
	 * Additional CSS classes for the container
	 */
	className?: string;
}

/**
 * FeatureCard - Reusable feature card component
 *
 * Displays a feature with an icon, title, and description.
 * Commonly used in landing pages and marketing sections.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<Brain className="h-8 w-8 text-primary" />}
 *   iconBgColor="bg-primary/10"
 *   title="AI-Powered Hints"
 *   description="Get intelligent hints when you're stuck"
 * />
 * ```
 */
export function FeatureCard({
	icon,
	iconBgColor = 'bg-primary/10',
	title,
	description,
	className,
}: FeatureCardProps) {
	return (
		<div className={cn('text-center', className)}>
			<div
				className={cn(
					'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
					iconBgColor,
				)}>
				{icon}
			</div>
			<H3 className="text-center">{title}</H3>
			<Small className="text-pretty text-center">{description}</Small>
		</div>
	);
}
