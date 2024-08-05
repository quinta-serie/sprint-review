import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#362740',
        },
        secondary: {
            main: '#F7C43A',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#EEEEEE',
            paper: '#F5F5F5',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#4A3C53',
        },
        secondary: {
            main: '#FACA54',
        },
        text: {
            primary: '#FFF'
        },
        background: {
            default: '#161417',
            paper: '#121212',
        }
    },
};

export default { light, dark };