import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Large } from '@/components/ui/typography';
import { useSession } from '@/hooks';
import { translations } from '@/locales';
import { AppLogo } from './app-logo';
import { ThemeToggle } from './theme-toggle';
import { UserProfileButton } from './user-profile-button';

export interface AppHeaderProps {
	/**
	 * Optional custom app name. Defaults to the app name from locales.
	 */
	appName?: string;
	/**
	 * Optional navigation items. If not provided, uses default navigation.
	 */
	showNavigation?: boolean;
	/**
	 * Optional custom navigation items to render in the header.
	 */
	navigationItems?: React.ReactNode;
	/**
	 * Optional action button to render on the right side.
	 */
	actionButton?: React.ReactNode;
	/**
	 * Optional custom logo/icon to render instead of the default Brain icon.
	 */
	logo?: React.ReactNode;
}

/**
 * AppHeader - Main application header component
 *
 * Provides a consistent header across the application with:
 * - App logo and name
 * - Navigation menu (responsive - hidden on mobile)
 * - Action button (automatically shows UserProfileButton when authenticated, or sign in button when not)
 *
 * @example
 * ```tsx
 * <AppHeader />
 * ```
 *
 * @example
 * ```tsx
 * <AppHeader
 *   actionButton={<CustomButton />}
 *   showNavigation={false}
 * />
 * ```
 */
export function AppHeader({
	appName = translations.common.app.name,
	showNavigation = true,
	navigationItems,
	actionButton,
	logo,
}: AppHeaderProps) {
	const { isAuthenticated } = useSession();

	const defaultNavigationItems = (
		<>
			<Button variant="ghost" size="sm">
				{translations.common.navigation.practice}
			</Button>
			<Button variant="ghost" size="sm">
				{translations.common.navigation.progress}
			</Button>
			<Button variant="ghost" size="sm">
				{translations.common.navigation.about}
			</Button>
		</>
	);

	const defaultActionButton = isAuthenticated ? (
		<UserProfileButton />
	) : (
		<LinkButton to="/login" size="sm">
			{translations.common.navigation.signIn}
		</LinkButton>
	);

	const defaultLogo = <AppLogo size="lg" />;

	return (
		<header className="border-border border-b bg-card">
			<div className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center p-4">
				<Link to="/" className="flex items-center gap-2">
					{logo ?? defaultLogo}
					<Large className="mb-0">{appName}</Large>
				</Link>

				{showNavigation && (
					<nav className="hidden flex-1 justify-center gap-6 md:flex">
						{navigationItems ?? defaultNavigationItems}
					</nav>
				)}

				<div className="ml-auto flex min-w-48 items-center">
					<ThemeToggle />
					<div className="w-2" />
					{actionButton ?? defaultActionButton}
				</div>
			</div>
		</header>
	);
}
