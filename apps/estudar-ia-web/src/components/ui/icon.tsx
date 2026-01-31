import { cva, type VariantProps } from 'class-variance-authority';
import {
	BookOpen,
	Brain,
	type LucideIcon,
	Sparkles,
	Target,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Icon Size Variants (Limited for Consistency)
// ============================================================================

const iconVariants = cva('', {
	variants: {
		size: {
			xs: 'h-3 w-3', // 12px - For badges, small indicators
			sm: 'h-4 w-4', // 16px - For inline text, small buttons
			md: 'h-5 w-5', // 20px - Default size, section headers
			lg: 'h-6 w-6', // 24px - For headers, prominent UI elements
			xl: 'h-8 w-8', // 32px - For feature cards, large displays
			'2xl': 'h-16 w-16', // 64px - For hero sections, main features
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type IconSize = NonNullable<VariantProps<typeof iconVariants>['size']>;

export interface IconProps
	extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'size'>,
		VariantProps<typeof iconVariants> {
	/**
	 * Lucide icon component to render
	 */
	icon: LucideIcon;
}

/**
 * Icon - Wrapper for Lucide icons with standardized sizes
 *
 * Provides consistent icon sizing across the application.
 * Sizes are limited to maintain visual consistency.
 *
 * @example
 * ```tsx
 * <Icon icon={Brain} size="lg" className="text-primary" />
 * ```
 */
const Icon = React.forwardRef<SVGSVGElement, IconProps>(
	({ icon: LucideIconComponent, size, className, ...props }, ref) => {
		return (
			<LucideIconComponent
				ref={ref}
				className={cn(iconVariants({ size }), className)}
				{...props}
			/>
		);
	},
);
Icon.displayName = 'Icon';

// ============================================================================
// Application-Specific Icons
// ============================================================================

/**
 * BrainIcon - AI/Intelligence icon
 * Used for: App logo, AI features, intelligent hints
 */
export interface BrainIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const BrainIcon = React.forwardRef<SVGSVGElement, BrainIconProps>(
	(props, ref) => <Icon ref={ref} icon={Brain} {...props} />,
);
BrainIcon.displayName = 'BrainIcon';

/**
 * BookOpenIcon - Reading/Learning icon
 * Used for: Subjects, study materials, detailed solutions
 */
export interface BookOpenIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const BookOpenIcon = React.forwardRef<SVGSVGElement, BookOpenIconProps>(
	(props, ref) => <Icon ref={ref} icon={BookOpen} {...props} />,
);
BookOpenIcon.displayName = 'BookOpenIcon';

/**
 * TargetIcon - Goal/Objective icon
 * Used for: Exams, targeted practice, focus areas
 */
export interface TargetIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const TargetIcon = React.forwardRef<SVGSVGElement, TargetIconProps>(
	(props, ref) => <Icon ref={ref} icon={Target} {...props} />,
);
TargetIcon.displayName = 'TargetIcon';

/**
 * SparklesIcon - New/Highlight icon
 * Used for: New features, highlights, special badges
 */
export interface SparklesIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const SparklesIcon = React.forwardRef<SVGSVGElement, SparklesIconProps>(
	(props, ref) => <Icon ref={ref} icon={Sparkles} {...props} />,
);
SparklesIcon.displayName = 'SparklesIcon';

// ============================================================================
// Exports
// ============================================================================

export {
	BookOpenIcon,
	BrainIcon,
	Icon,
	SparklesIcon,
	TargetIcon,
	iconVariants,
};
