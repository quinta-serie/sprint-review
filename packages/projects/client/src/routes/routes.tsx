import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import App from '@/App';
import Home from '@/pages/Home';
import Signin from '@/pages/Signin';
import Boards from '@/pages/Boards';
import Invite from '@/pages/Invite';
import Account from '@/pages/Account';
import Teams, { TeamProvider } from '@/pages/Teams';
import TeamDetails from '@/pages/Teams/TeamDetails';
import TeamBoards from '@/pages/Teams/TeamDetails/Boards';
import TeamMembers from '@/pages/Teams/TeamDetails/Members';
import TeamSettings from '@/pages/Teams/TeamDetails/Settings';

import { UserLoggedOutGuard, UserLoggedGuard } from './LoggedGuard';

function getBase() {
    const base = import.meta.env.BASE_URL;
    return base === '/' ? '/' : `${base}/`;
}

export const router = createBrowserRouter([
    {
        path: '',
        element: (
            <UserLoggedOutGuard>
                <App />
            </UserLoggedOutGuard>
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
                element: (
                    <TeamProvider>
                        <Outlet />
                    </TeamProvider>
                ),
                children: [
                    {
                        path: '',
                        element: <Teams />,
                    },
                    {
                        path: ':teamId',
                        element: <TeamDetails />,
                        children: [
                            {
                                path: 'members',
                                element: <TeamMembers />,
                            },
                            {
                                path: 'settings',
                                element: <TeamSettings />,
                            },
                            {
                                path: 'boards',
                                element: <TeamBoards />,
                            }
                        ]
                    }
                ]
            },
            {
                path: '/my-account',
                element: <Account />,
            },
            {
                path: '/invite/:teamId',
                element: <Invite />,
            },
        ]
    },
    {
        path: 'auth',
        element: <Navigate to="/signin" replace={true} />,
    },
    {
        path: '/signin',
        element: (
            <UserLoggedGuard>
                <Signin />
            </UserLoggedGuard>
        ),
    }
], { basename: getBase() });
