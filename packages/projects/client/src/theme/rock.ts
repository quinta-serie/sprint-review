import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#00A868',
        },
        secondary: {
            main: '#00170E',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#E6FFF5',
            paper: '#D9F2E8',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#3DB278',
        },
        secondary: {
            main: '#1C2C25',
        },
        text: {
            primary: '#FFF'
        },
        background: {
            default: '#171F1A',
            paper: '#121212',
        }
    },
};

export default { light, dark };