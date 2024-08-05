import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#FF5E00',
        },
        secondary: {
            main: '#6E0AD6',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#FFEFE6',
            paper: '#F2E2D9',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF732B',
        },
        secondary: {
            main: '#8334DB',
        },
        text: {
            primary: '#FFF'
        },
        background: {
            default: '#282828',
            paper: '#121212',
        }
    },
};

export default { light, dark };