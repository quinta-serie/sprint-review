import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#0866FF',
        },
        secondary: {
            main: '#191A26',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#FFFFFF',
            paper: '#F0F2F5',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#0866FF',
        },
        secondary: {
            main: '#B3B7FF',
        },
        text: {
            primary: '#FFF'
        },
        background: {
            default: '#242526',
            paper: '#18191A',
        }
    },
};

export default { light, dark };