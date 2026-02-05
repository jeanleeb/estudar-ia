import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_STORE_KEY } from '@/core/theme';

export type ThemeType = 'system' | 'light' | 'dark';

interface ThemeStoreState {
	theme?: ThemeType;
}

interface ThemeStoreActions {
	setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeStoreState & ThemeStoreActions>()(
	persist(
		set => ({
			setTheme: (theme: ThemeType) => set({ theme }),
		}),
		{
			name: THEME_STORE_KEY,
		},
	),
);
