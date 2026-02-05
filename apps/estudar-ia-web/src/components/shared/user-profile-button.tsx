import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { BarChart, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SESSION_QUERY_KEY, useSession } from '@/hooks';
import { translations } from '@/locales';
import { logoutFn } from '@/server/functions/auth';

/**
 * Gets initials from a user's name.
 * @param name - Full name of the user
 * @returns Initials (e.g., "John Doe" -> "JD")
 */
function getInitials(name?: string): string {
	if (!name) return translations.common.user.defaultName.substring(0, 2);

	const parts = name.trim().split(' ');
	if (parts.length === 1) {
		return parts[0].substring(0, 2).toUpperCase();
	}

	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * UserProfileButton - Dropdown menu component for authenticated users
 *
 * Displays user avatar and name with a dropdown menu containing:
 * - User profile link
 * - Progress tracking link
 * - Settings link
 * - Logout action
 *
 * @example
 * ```tsx
 * <UserProfileButton />
 * ```
 */
export function UserProfileButton() {
	const { user } = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: () => logoutFn(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
		},
	});

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const userName = user?.firstName
		? `${user.firstName} ${user.lastName || ''}`.trim()
		: translations.common.user.defaultName;
	const userEmail = user?.email;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button variant="ghost" className="h-9 gap-2 px-2">
					<Avatar className="h-7 w-7">
						<AvatarFallback className="bg-primary text-primary-foreground text-xs">
							{getInitials(userName)}
						</AvatarFallback>
					</Avatar>
					<span className="hidden font-medium text-sm lg:inline-block">
						{userName?.split(' ')[0] || translations.common.user.defaultName}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<div className="flex items-center gap-2 px-2 py-1.5">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="bg-primary text-primary-foreground text-xs">
							{getInitials(userName)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col space-y-0.5">
						<p className="font-medium text-sm">
							{userName || translations.common.user.defaultName}
						</p>
						<p className="text-muted-foreground text-xs">{userEmail}</p>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => navigate({ to: '/' })}
					className="cursor-pointer">
					<User className="mr-2 h-4 w-4" />
					{translations.common.user.profile}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigate({ to: '/' })}
					className="cursor-pointer">
					<BarChart className="mr-2 h-4 w-4" />
					{translations.common.user.myProgress}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigate({ to: '/' })}
					className="cursor-pointer">
					<Settings className="mr-2 h-4 w-4" />
					{translations.common.user.settings}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer text-destructive focus:text-destructive"
					onClick={handleLogout}
					disabled={logoutMutation.isPending}>
					<LogOut className="mr-2 h-4 w-4" />
					{translations.common.user.logout}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
