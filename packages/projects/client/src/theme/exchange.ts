import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#6E0AD6',
        },
        secondary: {
            main: '#F28000',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#F2E6FF',
            paper: '#E5D9F2',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#9437F6',
        },
        secondary: {
            main: '#FFA540',
        },
        text: {
            primary: '#FFF'
        },
        background: {
            default: '#1F1825',
            paper: '#121212',
        }
    },
};

export default { light, dark };