import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#0092FF',
        },
        secondary: {
            main: '#9A00FF',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#E6F4FF',
            paper: '#D9E7F2',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#4A9DFF',
        },
        secondary: {
            main: '#A939FF',
        },
        text: {
            primary: '#FFF'
        },
        background: {
            default: '#191D26',
            paper: '#121212',
        }
    },
};

export default { light, dark };