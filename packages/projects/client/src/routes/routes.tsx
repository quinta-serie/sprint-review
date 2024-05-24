import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '@/App';
import Signin from '@/pages/Signin';
import Boards from '@/pages/Boards';

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
        children: [
            {
                path: '',
                element: <Navigate to="/boards" replace={true} />,
            },
            {
                path: '/boards',
                element: <Boards />,
            }
        ]
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
