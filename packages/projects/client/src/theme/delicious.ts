import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#E91A27',
        },
        secondary: {
            main: '#FEC704',
        },
        text: {
            primary: '#000'
        },
        background: {
            default: '#FFEAE8',
            paper: '#F2D9DA',
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
            main: '#FFCD3B',
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