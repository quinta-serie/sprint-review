import { createContext, useEffect, useMemo, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import local from '@/utils/local';
import THEMES, { type Theme } from '@/theme';

import type { Mode } from './interface';

interface Preferences { mode: Mode; theme: Theme; }

interface PersonalThemeContextConfig {
    mode: Mode;
    theme: Theme;
    changeMode: (mode: Mode) => void;
    changeTheme: (theme: Theme) => void;
}

export const PersonalThemeContext = createContext<PersonalThemeContextConfig>({
    mode: 'light',
    theme: 'original',
    changeMode: () => null,
    changeTheme: () => null
});

interface PersonalThemeProps { children: React.JSX.Element; }
export default function PersonalThemeProvider({ children }: PersonalThemeProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState<Mode>(prefersDarkMode ? 'dark' : 'light');
    const [theme, setTheme] = useState<Theme>('original');

    useEffect(() => {
        const preferences = local.get<Preferences>('preferences', true);

        if (preferences) {
            setMode(preferences.mode);
            setTheme(preferences.theme);
        }
    }, []);

    const context = useMemo<PersonalThemeContextConfig>(() => ({
        mode,
        theme,
        changeMode: (m) => { handleChangeMode(m); },
        changeTheme: (t) => { handleChangeTheme(t); }
    }), [mode, theme]);

    const handleChangeMode = (m: Mode) => {
        local.set('preferences', { mode: m, theme });
        setMode(m);
    };

    const handleChangeTheme = (t: Theme) => {
        local.set('preferences', { mode, theme: t });
        setTheme(t);
    };

    return (
        <PersonalThemeContext.Provider value={context}>
            <ThemeProvider theme={createTheme(THEMES[theme][mode])}>
                {children}
            </ThemeProvider>
        </PersonalThemeContext.Provider>
    );
}