import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '@/App';
import Home from '@/pages/Home';
import Teams from '@/pages/Teams';
import Signin from '@/pages/Signin';
import Boards from '@/pages/Boards';
import Account from '@/pages/Account';

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
                element: <Navigate to="/home" replace={true} />,
            },
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/boards',
                element: <Boards />,
            },
            {
                path: '/teams',
                element: <Teams />,
            },
            {
                path: '/my-account',
                element: <Account />,
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
