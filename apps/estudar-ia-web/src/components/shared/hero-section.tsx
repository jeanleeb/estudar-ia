import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { Display, Lead } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
	/**
	 * Optional badge to display above the title
	 */
	badge?: {
		icon?: React.ReactNode;
		text: string;
		variant?: 'default' | 'secondary' | 'destructive' | 'outline';
	};
	/**
	 * Main title of the hero section
	 */
	title: string;
	/**
	 * Description/lead text below the title
	 */
	description?: string;
	/**
	 * Optional action buttons or CTA elements
	 */
	actions?: React.ReactNode;
	/**
	 * Maximum width constraint for the content
	 * @default 'max-w-3xl'
	 */
	maxWidth?: string;
	/**
	 * Additional CSS classes for the section
	 */
	className?: string;
	/**
	 * Additional CSS classes for the container
	 */
	containerClassName?: string;
	/**
	 * CSS classes for atmospheric background effects (e.g., gradients, patterns)
	 */
	backgroundClassName?: string;
	/**
	 * Additional content rendered below the actions (e.g., scroll hint)
	 */
	children?: React.ReactNode;
}

/**
 * HeroSection - Reusable hero section component for landing pages
 *
 * Provides a centered, responsive hero section with:
 * - Optional badge with icon
 * - Large title
 * - Lead description text
 * - Optional action buttons
 *
 * @example
 * ```tsx
 * <HeroSection
 *   badge={{ icon: <Sparkles />, text: "New" }}
 *   title="Welcome to our app"
 *   description="Start your journey today"
 *   actions={<Button>Get Started</Button>}
 * />
 * ```
 */
export function HeroSection({
	badge,
	title,
	description,
	actions,
	maxWidth = 'max-w-3xl',
	className,
	containerClassName,
	backgroundClassName,
	children,
}: HeroSectionProps) {
	return (
		<section
			className={cn(
				'border-border border-b bg-card',
				backgroundClassName,
				className,
			)}>
			<div
				className={cn(
					'container mx-auto px-4 py-16 md:py-24',
					containerClassName,
				)}>
				<div className={cn('mx-auto text-center', maxWidth)}>
					{badge && (
						<div className="animate-fade-up">
							<Badge variant={badge.variant ?? 'secondary'} className="mb-4">
								{badge.icon && <span className="mr-1">{badge.icon}</span>}
								{badge.text}
							</Badge>
						</div>
					)}
					<div className="animate-delay-150 animate-fade-up">
						<Display className="text-center">{title}</Display>
					</div>
					{description && (
						<div className="animate-delay-300 animate-fade-up">
							<Lead className="text-center">{description}</Lead>
						</div>
					)}
					{actions && (
						<div className="mt-6 animate-delay-450 animate-fade-up">
							{actions}
						</div>
					)}
				</div>
				{children}
			</div>
		</section>
	);
}
