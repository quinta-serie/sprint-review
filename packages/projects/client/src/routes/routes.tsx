import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import App from '@/App';
import Home from '@/pages/Home';
import Teams from '@/pages/Teams';
import Board from '@/pages/Board';
import Signin from '@/pages/Signin';
import Account from '@/pages/Account';
import Layout from '@/layout/Default';
import Toinvite from '@/pages/ToInvite';
import { TeamsProvider } from '@/pages/Teams';
import BoardProvider from '@/pages/Board/BoardProvider';
import TeamBoards from '@/pages/Teams/TeamDetails/Boards';
import TeamMembers from '@/pages/Teams/TeamDetails/Members';
import TeamInvites from '@/pages/Teams/TeamDetails/Invites';
import TeamSettings from '@/pages/Teams/TeamDetails/Settings';
import InviteUserModalProvider from '@/pages/Teams/InviteUserModal';
import TeamDetails, { TeamDetailsProvider } from '@/pages/Teams/TeamDetails';

import { UserLoggedOutGuard } from './LoggedGuard';

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
                element: (
                    <TeamsProvider>
                        <Layout>
                            <Outlet />
                        </Layout>
                    </TeamsProvider>
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
                        path: '/teams',
                        element: <Outlet />,
                        children: [
                            {
                                path: '',
                                element: (
                                    <InviteUserModalProvider>
                                        <Teams />
                                    </InviteUserModalProvider>
                                ),
                            },
                            {
                                path: ':teamId',
                                element: (
                                    <TeamDetailsProvider>
                                        <TeamDetails />
                                    </TeamDetailsProvider>
                                ),
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
                                    },
                                    {
                                        path: 'invites',
                                        element: (
                                            <InviteUserModalProvider>
                                                <TeamInvites />
                                            </InviteUserModalProvider>
                                        ),
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: '/board/:boardId',
                        element: (
                            <BoardProvider>
                                <Board />
                            </BoardProvider>
                        ),
                    },
                    {
                        path: '/my-account',
                        element: <Account />,
                    },
                    {
                        path: '/to-invite/:teamId',
                        element: <Toinvite />,
                    },
                ],
            },
            {
                path: 'auth',
                children: [
                    {
                        path: 'signin',
                        element: (
                            <Signin />
                        ),
                    },
                ],
            },
        ]
    },
], { basename: getBase() });
