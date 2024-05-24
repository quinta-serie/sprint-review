import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '@/App';
import Signin from '@/pages/auth/Signin';

import { UserLoggedGuard } from './LoggedOutGuard';

function getBase() {
    const base = import.meta.env.BASE_URL;
    return base === '/' ? '/' : `${base}/`;
}

export const router = createBrowserRouter([
    {
        path: '',
        element: (
            <UserLoggedGuard>
                <App />
            </UserLoggedGuard>
        ),
    },
    {
        path: 'auth',
        element: <Navigate to="/signin" replace={true} />,
    },
    {
        path: '/signin',
        element: <Signin />,
    }
], { basename: getBase() });
