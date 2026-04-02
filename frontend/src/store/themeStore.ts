import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

function applyTheme(theme: Theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
}

export function hydrateTheme() {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) applyTheme(saved);
}

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: (localStorage.getItem('theme') as Theme) ?? 'system',

    setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
    },
}));
