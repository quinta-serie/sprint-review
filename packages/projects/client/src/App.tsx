import { Outlet } from 'react-router-dom';

import type { PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Layout from '@/layout/Default';

import theme from './theme';

function App() {
    const getTokens = (mode: PaletteMode) => { return createTheme(theme[mode]); };
    return (
        <ThemeProvider theme={getTokens('light')}>
            <Layout>
                <Outlet />
            </Layout>
        </ThemeProvider>
    );
}

export default App;
