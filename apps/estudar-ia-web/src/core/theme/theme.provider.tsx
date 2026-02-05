import { ScriptOnce } from '@tanstack/react-router';

export const THEME_STORE_KEY = 'theme-store';

const themeScript = `(function() {
  try {
    let theme = 'system';
    const themeStore = localStorage.getItem('${THEME_STORE_KEY}');
    if (themeStore) {
      const parsedThemeStore = JSON.parse(themeStore);
      theme = parsedThemeStore.state.theme;
    }
    const resolved = theme === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.add(resolved);
    localStorage.setItem('${THEME_STORE_KEY}', JSON.stringify({ state: { theme: theme }, version: 0 }));
  } catch (e) {}
})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			<ScriptOnce>{themeScript}</ScriptOnce>
			{children}
		</>
	);
}
