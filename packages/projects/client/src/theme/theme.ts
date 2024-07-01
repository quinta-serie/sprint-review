import type { ThemeOptions } from '@mui/material/styles';

const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#362740',
        },
        secondary: {
            main: '#f7c43a',
        },
        // action: {
        //     active: '#e1515f',
        // },
        background: {
            default: '#eeeeee',
            paper: '#f5f5f5',
        }
    },
};

const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#362740',
        },
        secondary: {
            main: '#f7c43a',
        },
        // action: {
        //     active: '#e1515f',
        // },
        background: {
            default: '#262c3f',
            paper: '#151a2c',
        }
    },
};

export default { light, dark };