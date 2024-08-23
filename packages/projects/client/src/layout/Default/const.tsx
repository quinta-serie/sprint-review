import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import CoffeeIcon from '@mui/icons-material/Coffee';
import GitHubIcon from '@mui/icons-material/GitHub';
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

const BUTTONS_REF: Array<IButton> = [
    {
        label: 'Me page um café',
        path: 'pix',
        internal: true,
        icon: <CoffeeIcon />
    },
    {
        label: 'Github',
        path: 'https://github.com/quinta-serie/sprint-review',
        internal: false,
        icon: <GitHubIcon />
    },
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
    ref: BUTTONS_REF,
    main: BUTTONS_MAIN,
    support: BUTTONS_SUPPORT,
};