import { vi } from 'vitest';

vi.mock('@/components/ui/icon', () => ({
	AlertCircleIcon: ({ size }: { size?: string }) => (
		<span data-testid="alert-circle-icon" data-size={size}>
			AlertCircleIcon
		</span>
	),
	RefreshCwIcon: ({ size }: { size?: string }) => (
		<span data-testid="refresh-cw-icon" data-size={size}>
			RefreshCwIcon
		</span>
	),
	SmileIcon: ({ size }: { size?: string }) => (
		<span data-testid="smile-icon" data-size={size}>
			SmileIcon
		</span>
	),
}));
