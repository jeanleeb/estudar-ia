/**
 * Typography Shimmer Components
 *
 * Architecture: Shared CVA Variants for Automatic Synchronization
 * ================================================================
 *
 * These shimmer components use shared CVA variants exported from typography.tsx:
 * - headingSpacingVariants: Margins for all heading levels (mb-6, mb-4, mb-2, etc.)
 * - headingHeightVariants: Heights based on line-heights (h-12, h-8, h-7, etc.)
 * - textSpacingVariants: Margins for text variants
 * - textHeightVariants: Heights based on text sizes
 *
 * Benefits:
 * ✅ Single source of truth - all spacing/heights defined once
 * ✅ Automatic synchronization - changes to typography instantly reflect here
 * ✅ Zero maintenance - no manual syncing required
 * ✅ Type-safe - TypeScript ensures variant consistency
 *
 * Example: If typography.tsx changes H3 from mb-2 to mb-4, H3Shimmer
 * automatically updates without any code changes needed here.
 */

import { Skeleton } from '@/components/ui/skeleton';
import {
	headingHeightVariants,
	headingSpacingVariants,
	textHeightVariants,
	textSpacingVariants,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

/**
 * Common props for typography shimmer components
 */
export interface TypographyShimmerProps {
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Predefined width variants
	 * @default 'full'
	 */
	width?: 'full' | '3/4' | '2/3' | '1/2' | '1/3' | '1/4';
}

/**
 * Width variant classes mapping
 */
const widthVariants = {
	full: 'w-full',
	'3/4': 'w-3/4',
	'2/3': 'w-2/3',
	'1/2': 'w-1/2',
	'1/3': 'w-1/3',
	'1/4': 'w-1/4',
};

// ============================================================================
// Heading Shimmer Components
// ============================================================================

/**
 * H1Shimmer - Loading state for H1 heading
 * Uses shared spacing and height variants from typography components
 */
export function H1Shimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				headingSpacingVariants({ level: 'h1' }),
				headingHeightVariants({ level: 'h1' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * H2Shimmer - Loading state for H2 heading
 * Uses shared spacing and height variants from typography components
 */
export function H2Shimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				headingSpacingVariants({ level: 'h2' }),
				headingHeightVariants({ level: 'h2' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * H3Shimmer - Loading state for H3 heading
 * Uses shared spacing and height variants from typography components
 */
export function H3Shimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				headingSpacingVariants({ level: 'h3' }),
				headingHeightVariants({ level: 'h3' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * H4Shimmer - Loading state for H4 heading
 * Uses shared spacing and height variants from typography components
 */
export function H4Shimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				headingSpacingVariants({ level: 'h4' }),
				headingHeightVariants({ level: 'h4' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * H5Shimmer - Loading state for H5 heading
 * Uses shared spacing and height variants from typography components
 */
export function H5Shimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				headingSpacingVariants({ level: 'h5' }),
				headingHeightVariants({ level: 'h5' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * H6Shimmer - Loading state for H6 heading
 * Uses shared spacing and height variants from typography components
 */
export function H6Shimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				headingSpacingVariants({ level: 'h6' }),
				headingHeightVariants({ level: 'h6' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

// ============================================================================
// Text Shimmer Components
// ============================================================================

/**
 * TextShimmer - Loading state for default text/paragraph
 * Uses shared spacing and height variants from typography components
 */
export function TextShimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				textSpacingVariants({ variant: 'default' }),
				textHeightVariants({ variant: 'default' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * LeadShimmer - Loading state for lead paragraph
 * Uses shared spacing and height variants from typography components
 */
export function LeadShimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				textSpacingVariants({ variant: 'lead' }),
				textHeightVariants({ variant: 'lead' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * LargeShimmer - Loading state for large text
 * Uses shared spacing and height variants from typography components
 */
export function LargeShimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				textSpacingVariants({ variant: 'large' }),
				textHeightVariants({ variant: 'large' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * SmallShimmer - Loading state for small text
 * Uses shared spacing and height variants from typography components
 */
export function SmallShimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				textSpacingVariants({ variant: 'small' }),
				textHeightVariants({ variant: 'small' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * MutedShimmer - Loading state for muted text
 * Uses shared spacing and height variants from typography components
 */
export function MutedShimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				textSpacingVariants({ variant: 'muted' }),
				textHeightVariants({ variant: 'muted' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

/**
 * SubtleShimmer - Loading state for subtle text
 * Uses shared spacing and height variants from typography components
 */
export function SubtleShimmer({
	className,
	width = 'full',
}: TypographyShimmerProps) {
	return (
		<Skeleton
			className={cn(
				textSpacingVariants({ variant: 'subtle' }),
				textHeightVariants({ variant: 'subtle' }),
				widthVariants[width],
				className,
			)}
		/>
	);
}

// ============================================================================
// Multi-line Shimmer Components
// ============================================================================

export interface MultiLineShimmerProps {
	/**
	 * Number of lines to display
	 * @default 3
	 */
	lines?: number;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Spacing between lines
	 * @default 'space-y-2'
	 */
	spacing?: 'space-y-1' | 'space-y-2' | 'space-y-3' | 'space-y-4';
	/**
	 * Height of each line
	 * @default 'h-5'
	 */
	lineHeight?: 'h-4' | 'h-5' | 'h-6' | 'h-7';
}

/**
 * ParagraphShimmer - Loading state for multi-line paragraph
 * Creates multiple skeleton lines with the last line being shorter
 *
 * @example
 * ```tsx
 * <ParagraphShimmer lines={3} />
 * ```
 */
export function ParagraphShimmer({
	lines = 3,
	className,
	spacing = 'space-y-2',
	lineHeight = 'h-5',
}: MultiLineShimmerProps) {
	return (
		<output className={cn(spacing, className)}>
			<span className="sr-only">Loading content...</span>
			{Array.from({ length: lines }).map((_, index) => (
				<Skeleton
					key={index}
					className={cn(lineHeight, index === lines - 1 ? 'w-2/3' : 'w-full')}
				/>
			))}
		</output>
	);
}

// ============================================================================
// Composite Shimmer Components
// ============================================================================

export interface HeadingWithTextShimmerProps {
	/**
	 * Heading level
	 * @default 'h3'
	 */
	level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	/**
	 * Number of text lines below heading
	 * @default 2
	 */
	textLines?: number;
	/**
	 * Additional CSS classes for wrapper
	 */
	className?: string;
}

/**
 * HeadingWithTextShimmer - Loading state for heading + text combination
 * Displays a heading skeleton followed by text line skeletons
 *
 * @example
 * ```tsx
 * <HeadingWithTextShimmer level="h3" textLines={2} />
 * ```
 */
export function HeadingWithTextShimmer({
	level = 'h3',
	textLines = 2,
	className,
}: HeadingWithTextShimmerProps) {
	const HeadingComponent = {
		h1: H1Shimmer,
		h2: H2Shimmer,
		h3: H3Shimmer,
		h4: H4Shimmer,
		h5: H5Shimmer,
		h6: H6Shimmer,
	}[level];

	return (
		<div className={className}>
			<HeadingComponent width="3/4" />
			<ParagraphShimmer lines={textLines} />
		</div>
	);
}
