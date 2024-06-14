import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { IButton } from './interface';

const BUTTONS_MAIN: Array<IButton> = [
    {
        label: 'Home',
        path: '/home',
        internal: true,
        icon: <HomeIcon />
    },
    {
        label: 'Minhas retrôs',
        path: '/boards',
        internal: true,
        icon: <DashboardIcon />
    },
    {
        label: 'Meus times',
        path: '/teams',
        internal: true,
        icon: <GroupsIcon />
    },
    {
        label: 'Minha conta',
        path: '/my-account',
        internal: true,
        icon: <ManageAccountsIcon />
    }
];

const BUTTONS_SUPPORT: Array<IButton> = [
    {
        label: 'FAQ',
        path: 'helps',
        internal: true,
        icon: <HelpIcon />
    }
];

const BUTTONS_END: Array<IButton> = [
    {
        label: 'Sair',
        path: 'logout',
        internal: true,
        icon: <LogoutIcon />
    }
];

export const BUTTONS = {
    end: BUTTONS_END,
    main: BUTTONS_MAIN,
    support: BUTTONS_SUPPORT
};