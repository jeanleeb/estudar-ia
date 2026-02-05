import { GraduationCapIcon, type IconSize } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface AppLogoProps {
	size?: IconSize;
	className?: string;
}

export function AppLogo({ size = 'xl', className }: AppLogoProps) {
	return (
		<GraduationCapIcon size={size} className={cn('text-primary', className)} />
	);
}
