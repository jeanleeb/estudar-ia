import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	CheckIcon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
	SunMoonIcon,
} from '@/components/ui/icon';
import { translations } from '@/locales';
import { type ThemeType, useThemeStore } from '@/store/theme.store';

const ThemeMenuItem = ({
	onClick,
	selected,
	children,
}: {
	onClick: () => void;
	selected?: boolean;
	children: React.ReactNode;
}) => (
	<DropdownMenuItem onClick={onClick} className="cursor-pointer gap-2">
		{children}
		{selected && <CheckIcon size="sm" className="ml-auto" />}
	</DropdownMenuItem>
);

export function ThemeToggle() {
	const theme = useThemeStore(state => state.theme);

	const changeTheme = (newTheme: ThemeType) => {
		const root = document.documentElement;

		useThemeStore.getState().setTheme(newTheme);

		if (newTheme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light';
			root.classList.toggle('dark', systemTheme === 'dark');

			return;
		}

		root.classList.toggle('dark', newTheme === 'dark');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						aria-label={translations.common.theme.selectTheme}>
						<SunMoonIcon />
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-40">
				<ThemeMenuItem
					onClick={() => changeTheme('light')}
					selected={theme === 'light'}>
					<SunIcon className="text-muted-foreground" />
					{translations.common.theme.light}
				</ThemeMenuItem>
				<ThemeMenuItem
					onClick={() => changeTheme('dark')}
					selected={theme === 'dark'}>
					<MoonIcon className="text-muted-foreground" />
					{translations.common.theme.dark}
				</ThemeMenuItem>
				<ThemeMenuItem
					onClick={() => changeTheme('system')}
					selected={theme === 'system'}>
					<MonitorIcon className="text-muted-foreground" />
					{translations.common.theme.system}
				</ThemeMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
