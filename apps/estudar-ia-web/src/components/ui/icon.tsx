/**
 * @file Icon System - Centralized Icon Management
 *
 * ⚠️ IMPORTANT: This is the ONLY file that should import from 'lucide-react'
 *
 * All icons in the application MUST be:
 * 1. Defined in this file
 * 2. Exported as named components (e.g., BrainIcon, AlertCircleIcon)
 * 3. Used with standardized size props
 *
 * ❌ NEVER import directly from 'lucide-react' in other files
 * ✅ ALWAYS import from '@/components/ui/icon'
 *
 * For guidelines and best practices, see: ./ICON_GUIDELINES.md
 *
 * @example Correct Usage
 * ```tsx
 * import { BrainIcon, AlertCircleIcon } from '@/components/ui/icon';
 *
 * function MyComponent() {
 *   return (
 *     <div>
 *       <BrainIcon size="lg" className="text-primary" />
 *       <AlertCircleIcon size="md" />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example WRONG - Don't do this
 * ```tsx
 * // ❌ WRONG - Direct import from lucide-react
 * import { Brain, AlertCircle } from 'lucide-react';
 * ```
 */

import { cva, type VariantProps } from 'class-variance-authority';
import {
	AlertCircle,
	BookOpen,
	Brain,
	Check,
	CheckCircle,
	ChevronDown,
	ChevronRight,
	Circle,
	Eye,
	EyeOff,
	GraduationCap,
	Info,
	Loader2,
	type LucideIcon,
	Monitor,
	Moon,
	RefreshCw,
	Smile,
	Sparkles,
	Sun,
	SunMoon,
	Target,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Icon Size Variants (Limited for Consistency)
// ============================================================================
//
// These are the ONLY allowed icon sizes in the application.
// Using custom size classes (e.g., h-7 w-7) breaks visual consistency.
//

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
//
// IMPORTANT: When adding new icons:
// 1. Import the Lucide icon at the top of this file
// 2. Create an interface extending IconProps
// 3. Create a forwarded ref component using the Icon wrapper
// 4. Add JSDoc comment explaining usage
// 5. Export the component at the bottom
// 6. Document in ICON_GUIDELINES.md
//
// See existing icons below as examples.
//

/**
 * BrainIcon - AI/Intelligence icon
 * Used for: AI features, intelligent hints
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
 * GraduationCapIcon - Education/Academic icon
 * Used for: App logo
 */
export interface GraduationCapIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const GraduationCapIcon = React.forwardRef<
	SVGSVGElement,
	GraduationCapIconProps
>((props, ref) => <Icon ref={ref} icon={GraduationCap} {...props} />);
GraduationCapIcon.displayName = 'GraduationCapIcon';

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

/**
 * AlertCircleIcon - Error/Warning icon
 * Used for: Error states, warnings, alerts
 */
export interface AlertCircleIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const AlertCircleIcon = React.forwardRef<SVGSVGElement, AlertCircleIconProps>(
	(props, ref) => <Icon ref={ref} icon={AlertCircle} {...props} />,
);
AlertCircleIcon.displayName = 'AlertCircleIcon';

/**
 * RefreshCwIcon - Refresh/Retry icon
 * Used for: Retry actions, refresh data, reload
 */
export interface RefreshCwIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const RefreshCwIcon = React.forwardRef<SVGSVGElement, RefreshCwIconProps>(
	(props, ref) => <Icon ref={ref} icon={RefreshCw} {...props} />,
);
RefreshCwIcon.displayName = 'RefreshCwIcon';

/**
 * SmileIcon - Empty state/Positive icon
 * Used for: Empty states, no data, positive feedback
 */
export interface SmileIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const SmileIcon = React.forwardRef<SVGSVGElement, SmileIconProps>(
	(props, ref) => <Icon ref={ref} icon={Smile} {...props} />,
);
SmileIcon.displayName = 'SmileIcon';

/**
 * CircleIcon - Circle/Dot icon
 * Used for: Radio buttons, indicators, selection states
 */
export interface CircleIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const CircleIcon = React.forwardRef<SVGSVGElement, CircleIconProps>(
	(props, ref) => <Icon ref={ref} icon={Circle} {...props} />,
);
CircleIcon.displayName = 'CircleIcon';

/**
 * CheckIcon - Checkmark/Success icon
 * Used for: Selection indicators, success states, completed items
 */
export interface CheckIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const CheckIcon = React.forwardRef<SVGSVGElement, CheckIconProps>(
	(props, ref) => <Icon ref={ref} icon={Check} {...props} />,
);
CheckIcon.displayName = 'CheckIcon';

/**
 * CheckCircleIcon - Check with circle/Success icon
 * Used for: Success states, completed items, validation passed
 */
export interface CheckCircleIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const CheckCircleIcon = React.forwardRef<SVGSVGElement, CheckCircleIconProps>(
	(props, ref) => <Icon ref={ref} icon={CheckCircle} {...props} />,
);
CheckCircleIcon.displayName = 'CheckCircleIcon';

/**
 * SunIcon - Light theme icon
 * Used for: Light theme toggle, brightness controls
 */
export interface SunIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const SunIcon = React.forwardRef<SVGSVGElement, SunIconProps>((props, ref) => (
	<Icon ref={ref} icon={Sun} {...props} />
));
SunIcon.displayName = 'SunIcon';

/**
 * MoonIcon - Dark theme icon
 * Used for: Dark theme toggle, night mode
 */
export interface MoonIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const MoonIcon = React.forwardRef<SVGSVGElement, MoonIconProps>(
	(props, ref) => <Icon ref={ref} icon={Moon} {...props} />,
);
MoonIcon.displayName = 'MoonIcon';

/**
 * MonitorIcon - System theme icon
 * Used for: System theme toggle, device preferences
 */
export interface MonitorIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const MonitorIcon = React.forwardRef<SVGSVGElement, MonitorIconProps>(
	(props, ref) => <Icon ref={ref} icon={Monitor} {...props} />,
);
MonitorIcon.displayName = 'MonitorIcon';

/**
 * SunMoonIcon - Theme toggle icon
 * Used for: Theme switcher button, combined light/dark indicator
 */
export interface SunMoonIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const SunMoonIcon = React.forwardRef<SVGSVGElement, SunMoonIconProps>(
	(props, ref) => <Icon ref={ref} icon={SunMoon} {...props} />,
);
SunMoonIcon.displayName = 'SunMoonIcon';

/**
 * ChevronDownIcon - Down arrow/Scroll hint icon
 * Used for: Scroll indicators, expand actions, dropdown triggers
 */
export interface ChevronDownIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const ChevronDownIcon = React.forwardRef<SVGSVGElement, ChevronDownIconProps>(
	(props, ref) => <Icon ref={ref} icon={ChevronDown} {...props} />,
);
ChevronDownIcon.displayName = 'ChevronDownIcon';

/**
 * ChevronRightIcon - Right arrow/Navigation icon
 * Used for: Dropdown menus, navigation, submenu indicators
 */
export interface ChevronRightIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const ChevronRightIcon = React.forwardRef<SVGSVGElement, ChevronRightIconProps>(
	(props, ref) => <Icon ref={ref} icon={ChevronRight} {...props} />,
);
ChevronRightIcon.displayName = 'ChevronRightIcon';

/**
 * Loader2Icon - Loading spinner icon
 * Used for: Loading states, processing indicators, async operations
 */
export interface Loader2IconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const Loader2Icon = React.forwardRef<SVGSVGElement, Loader2IconProps>(
	(props, ref) => <Icon ref={ref} icon={Loader2} {...props} />,
);
Loader2Icon.displayName = 'Loader2Icon';

/**
 * InfoIcon - Information icon
 * Used for: Info messages, help text, informational alerts
 */
export interface InfoIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const InfoIcon = React.forwardRef<SVGSVGElement, InfoIconProps>(
	(props, ref) => <Icon ref={ref} icon={Info} {...props} />,
);
InfoIcon.displayName = 'InfoIcon';

/**
 * EyeIcon - Show/Visible icon
 * Used for: Show password, visibility toggle, reveal content
 */
export interface EyeIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const EyeIcon = React.forwardRef<SVGSVGElement, EyeIconProps>((props, ref) => (
	<Icon ref={ref} icon={Eye} {...props} />
));
EyeIcon.displayName = 'EyeIcon';

/**
 * EyeOffIcon - Hide/Hidden icon
 * Used for: Hide password, visibility toggle, conceal content
 */
export interface EyeOffIconProps
	extends Omit<IconProps, 'icon'>,
		VariantProps<typeof iconVariants> {}

const EyeOffIcon = React.forwardRef<SVGSVGElement, EyeOffIconProps>(
	(props, ref) => <Icon ref={ref} icon={EyeOff} {...props} />,
);
EyeOffIcon.displayName = 'EyeOffIcon';

// ============================================================================
// Exports
// ============================================================================

export {
	AlertCircleIcon,
	BookOpenIcon,
	BrainIcon,
	CheckCircleIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	CircleIcon,
	EyeIcon,
	EyeOffIcon,
	GraduationCapIcon,
	Icon,
	InfoIcon,
	Loader2Icon,
	MonitorIcon,
	MoonIcon,
	RefreshCwIcon,
	SmileIcon,
	SparklesIcon,
	SunIcon,
	SunMoonIcon,
	TargetIcon,
	iconVariants,
};
