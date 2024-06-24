import { Outlet } from 'react-router-dom';

import { SnackbarProvider, closeSnackbar } from 'notistack';

import type { PaletteMode } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';

import Layout from '@/layout/Default';

import theme from './theme';

function App() {
    const getTokens = (mode: PaletteMode) => { return createTheme(theme[mode]); };
    return (
        <ThemeProvider theme={getTokens('light')}>
            <SnackbarProvider
                maxSnack={3}
                hideIconVariant={false}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                action={(key) => (
                    <IconButton
                        size="small"
                        sx={{ color: 'white' }}
                        onClick={() => { closeSnackbar(key); }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            >
                <Layout>
                    <Outlet />
                </Layout>
            </SnackbarProvider>
        </ThemeProvider >
    );
}

export default App;
