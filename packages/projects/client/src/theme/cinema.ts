import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#E50914',
        },
        secondary: {
            main: '#141414',
        },
        background: {
            default: '#FFFFFF',
            paper: '#EBEBEB',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#F0463C',
        },
        secondary: {
            main: '#FFFFFF',
        },
        background: {
            default: '#141414',
            paper: '#282828',
        }
    },
};

export default { light, dark };