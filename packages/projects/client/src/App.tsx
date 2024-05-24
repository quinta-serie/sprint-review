import { Outlet } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
    return (
        <ThemeProvider theme={createTheme()}>
            <Outlet />
        </ThemeProvider>
    );
}

export default App;
