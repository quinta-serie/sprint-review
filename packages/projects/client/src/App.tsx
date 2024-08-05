import { Outlet } from 'react-router-dom';

import { SnackbarProvider, closeSnackbar } from 'notistack';

import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import PersonalThemeProvider from '@/components/PersonalTheme';

export default function App() {
    return (
        <PersonalThemeProvider>
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
                <Outlet />
            </SnackbarProvider>
        </PersonalThemeProvider >
    );
}
