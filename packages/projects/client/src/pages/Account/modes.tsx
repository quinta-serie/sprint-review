import React from 'react';

import { createTheme, Palette, PaletteColor, TypeBackground } from '@mui/material/styles';

import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ComputerIcon from '@mui/icons-material/Computer';

import THEMES, { type Theme } from '@/theme';
import { Mode } from '@/components/PersonalTheme';

export interface CardModes {
    text: string;
    mode: Mode;
    title: string;
    primary: PaletteColor;
    secondary: PaletteColor;
    background: TypeBackground;
    icon: React.JSX.Element;
}

export default (theme: Theme): CardModes[] => {
    const darkTheme = createTheme(THEMES[theme]['dark']);
    const lightTheme = createTheme(THEMES[theme]['light']);

    return [
        {
            icon: <WbSunnyIcon />,
            mode: 'light',
            title: 'Modo claro',
            background: lightTheme.palette.background,
            primary: lightTheme.palette.primary,
            secondary: lightTheme.palette.secondary,
            text: lightTheme.palette.text.primary,
        },
        {
            icon: <DarkModeIcon />,
            mode: 'dark',
            title: 'Modo escuro',
            background: darkTheme.palette.background,
            primary: darkTheme.palette.primary,
            secondary: darkTheme.palette.secondary,
            text: darkTheme.palette.text.primary,
        }
    ];
};