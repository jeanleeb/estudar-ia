import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Typography Architecture: Single Source of Truth
// ============================================================================
/**
 * Typography Variant System - Unified CVA Variants
 *
 * This file uses a single variant object for each component type (heading/text).
 * Shimmer components extract only the spacing and height classes they need.
 *
 * Benefits:
 * ✅ DRY: All styles (spacing + visual) defined once
 * ✅ Simple: Single variant object, no over-engineering
 * ✅ Automatic Sync: Shimmer extracts spacing from same variant
 * ✅ Type-Safe: TypeScript ensures consistency
 * ✅ Maintainable: Change once, everything updates
 *
 * Example:
 *
 * Real Component (H3):
 *   headingVariants({ level: 'h3' }) → 'mb-2 text-lg md:text-xl font-semibold...'
 *
 * Shimmer Component (H3Shimmer):
 *   Extracts: mb-2 (spacing) + h-7 (height, calculated from text-lg line-height)
 *
 * Result: Both use same source. Change mb-2 → mb-4, both update automatically!
 */

// ============================================================================
// Shared Variants (extracted for shimmer use)
// ============================================================================

/**
 * Heading spacing variants - extracted from headingVariants for shimmer use
 * These match the margin-bottom values in headingVariants below
 */
export const headingSpacingVariants = cva('', {
	variants: {
		level: {
			h1: 'mb-6',
			h2: 'mb-4',
			h3: 'mb-2',
			h4: 'mb-2',
			h5: 'mb-1.5',
			h6: 'mb-1',
		},
	},
});

/**
 * Heading height variants - for shimmer components
 * Heights are based on line-height of corresponding text sizes
 */
export const headingHeightVariants = cva('', {
	variants: {
		level: {
			h1: 'h-12', // text-4xl/6xl line-height
			h2: 'h-8', // text-2xl/3xl line-height
			h3: 'h-7', // text-lg/xl line-height
			h4: 'h-6', // text-base/lg line-height
			h5: 'h-5', // text-sm/base line-height
			h6: 'h-4', // text-xs/sm line-height
		},
	},
});

/**
 * Text spacing variants - extracted from textVariants for shimmer use
 * These match the margin-bottom values in textVariants below
 */
export const textSpacingVariants = cva('', {
	variants: {
		variant: {
			default: 'mb-4',
			lead: 'mb-6',
			large: 'mb-3',
			small: '',
			muted: '',
			subtle: '',
		},
	},
});

/**
 * Text height variants - for shimmer components
 * Heights are based on line-height of corresponding text sizes
 */
export const textHeightVariants = cva('', {
	variants: {
		variant: {
			default: 'h-6', // text-base line-height
			lead: 'h-7', // text-lg/xl line-height
			large: 'h-7', // text-lg line-height
			small: 'h-5', // text-sm line-height
			muted: 'h-5', // text-sm line-height
			subtle: 'h-4', // text-xs line-height
		},
	},
});

// ============================================================================
// Heading Components
// ============================================================================

const headingVariants = cva('font-semibold text-foreground', {
	variants: {
		level: {
			h1: 'mb-6 text-balance text-4xl font-bold md:text-6xl',
			h2: 'mb-4 text-2xl md:text-3xl',
			h3: 'mb-2 text-lg md:text-xl',
			h4: 'mb-2 text-base md:text-lg',
			h5: 'mb-1.5 text-sm md:text-base',
			h6: 'mb-1 text-xs md:text-sm',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
	},
	defaultVariants: {
		level: 'h2',
		align: 'left',
	},
});

export interface HeadingProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingVariants> {}

const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, align, ...props }, ref) => {
		return React.createElement('h1', {
			className: cn(headingVariants({ level: 'h1', align, className })),
			ref,
			...props,
		});
	},
);
H1.displayName = 'H1';

const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, align, ...props }, ref) => {
		return React.createElement('h2', {
			className: cn(headingVariants({ level: 'h2', align, className })),
			ref,
			...props,
		});
	},
);
H2.displayName = 'H2';

const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, align, ...props }, ref) => {
		return React.createElement('h3', {
			className: cn(headingVariants({ level: 'h3', align, className })),
			ref,
			...props,
		});
	},
);
H3.displayName = 'H3';

const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, align, ...props }, ref) => {
		return React.createElement('h4', {
			className: cn(headingVariants({ level: 'h4', align, className })),
			ref,
			...props,
		});
	},
);
H4.displayName = 'H4';

const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, align, ...props }, ref) => {
		return React.createElement('h5', {
			className: cn(headingVariants({ level: 'h5', align, className })),
			ref,
			...props,
		});
	},
);
H5.displayName = 'H5';

const H6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, align, ...props }, ref) => {
		return React.createElement('h6', {
			className: cn(headingVariants({ level: 'h6', align, className })),
			ref,
			...props,
		});
	},
);
H6.displayName = 'H6';

// ============================================================================
// Paragraph / Text Components
// ============================================================================

const textVariants = cva('', {
	variants: {
		variant: {
			default: 'mb-4 text-base text-foreground',
			lead: 'mb-6 text-pretty text-lg text-muted-foreground md:text-xl',
			large: 'mb-3 text-lg font-semibold text-foreground',
			small: 'text-sm text-muted-foreground',
			muted: 'text-sm text-muted-foreground',
			subtle: 'text-xs text-muted-foreground',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
	},
	defaultVariants: {
		variant: 'default',
		align: 'left',
	},
});

export interface TextProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof textVariants> {
	as?: 'p' | 'span' | 'div';
	balance?: boolean;
	pretty?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
	(
		{
			className,
			variant,
			align,
			as = 'p',
			balance = false,
			pretty = false,
			...props
		},
		ref,
	) => {
		return React.createElement(as, {
			className: cn(
				textVariants({ variant, align }),
				balance && 'text-balance',
				pretty && 'text-pretty',
				className,
			),
			ref: ref as any,
			...props,
		});
	},
);
Text.displayName = 'Text';

/**
 * Lead paragraph - Use for introductory or highlighted paragraphs.
 * Renders with larger text size and muted color for visual hierarchy.
 */
const Lead = React.forwardRef<HTMLParagraphElement, Omit<TextProps, 'variant'>>(
	(props, ref) => <Text variant="lead" ref={ref} {...props} />,
);
Lead.displayName = 'Lead';

/**
 * Large text - Use for emphasized text that needs more visual weight.
 * Renders with larger size and semibold weight.
 */
const Large = React.forwardRef<
	HTMLParagraphElement,
	Omit<TextProps, 'variant'>
>((props, ref) => <Text variant="large" ref={ref} {...props} />);
Large.displayName = 'Large';

/**
 * Small text - Use for captions, descriptions, and secondary information.
 * Renders with smaller size and muted color.
 */
const Small = React.forwardRef<
	HTMLParagraphElement,
	Omit<TextProps, 'variant'>
>((props, ref) => <Text variant="small" ref={ref} {...props} />);
Small.displayName = 'Small';

/**
 * Muted text - Use for de-emphasized or less important text.
 * Renders with smaller size and muted color, no bottom margin.
 */
const Muted = React.forwardRef<
	HTMLParagraphElement,
	Omit<TextProps, 'variant'>
>((props, ref) => <Text variant="muted" ref={ref} {...props} />);
Muted.displayName = 'Muted';

/**
 * Subtle text - Use for very discrete information like hints or footnotes.
 * Renders with extra small size and muted color.
 */
const Subtle = React.forwardRef<
	HTMLParagraphElement,
	Omit<TextProps, 'variant'>
>((props, ref) => <Text variant="subtle" ref={ref} {...props} />);
Subtle.displayName = 'Subtle';

// ============================================================================
// Blockquote Component
// ============================================================================

export interface BlockquoteProps
	extends React.HTMLAttributes<HTMLQuoteElement> {}

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
	({ className, ...props }, ref) => (
		<blockquote
			ref={ref}
			className={cn(
				'mt-6 border-border border-l-2 pl-6 text-muted-foreground italic',
				className,
			)}
			{...props}
		/>
	),
);
Blockquote.displayName = 'Blockquote';

// ============================================================================
// Code Components
// ============================================================================

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
	inline?: boolean;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
	({ className, inline = true, ...props }, ref) => (
		<code
			ref={ref}
			className={cn(
				'font-mono text-sm',
				inline
					? 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-semibold'
					: 'block rounded-lg bg-muted p-4',
				className,
			)}
			{...props}
		/>
	),
);
Code.displayName = 'Code';

// ============================================================================
// List Components
// ============================================================================

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
	ordered?: boolean;
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
	({ className, ordered = false, ...props }, ref) => {
		const Comp = ordered ? 'ol' : 'ul';
		return (
			<Comp
				ref={ref as React.Ref<HTMLUListElement & HTMLOListElement>}
				className={cn(
					'my-6 ml-6 text-foreground',
					ordered ? 'list-decimal' : 'list-disc',
					className,
				)}
				{...props}
			/>
		);
	},
);
List.displayName = 'List';

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
	({ className, ...props }, ref) => (
		<li ref={ref} className={cn('mt-2', className)} {...props} />
	),
);
ListItem.displayName = 'ListItem';

// ============================================================================
// Section Header Component (with icon support)
// ============================================================================

export interface SectionHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	icon?: React.ReactNode;
	iconBgColor?: string;
	title: string;
	subtitle?: string;
}

/**
 * Section Header - Use for consistent section headings with optional icon and subtitle.
 * Provides a standard layout pattern for section introductions throughout the app.
 */
const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
	(
		{
			className,
			icon,
			iconBgColor = 'bg-primary/10',
			title,
			subtitle,
			...props
		},
		ref,
	) => (
		<div
			ref={ref}
			className={cn('mb-6 flex items-center gap-3', className)}
			{...props}>
			{icon && (
				<div
					className={cn(
						'flex h-10 w-10 items-center justify-center rounded-lg',
						iconBgColor,
					)}>
					{icon}
				</div>
			)}
			<div>
				<H2 className="mb-0">{title}</H2>
				{subtitle && <Small>{subtitle}</Small>}
			</div>
		</div>
	),
);
SectionHeader.displayName = 'SectionHeader';

// ============================================================================
// Exports
// ============================================================================

export {
	Blockquote,
	Code,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	Large,
	Lead,
	List,
	ListItem,
	Muted,
	SectionHeader,
	Small,
	Subtle,
	Text,
	headingVariants,
	textVariants,
};
