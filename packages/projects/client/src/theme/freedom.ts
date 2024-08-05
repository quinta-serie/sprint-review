import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#EBD614',
        },
        secondary: {
            main: '#0265E9',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#FFFCE6',
            paper: '#F2F0D9',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#EFDA41',
        },
        secondary: {
            main: '#4774EC',
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