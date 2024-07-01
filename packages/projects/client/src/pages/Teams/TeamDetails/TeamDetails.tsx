import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

import Page from '@/layout/Page';

import useTeams from '../useTeams';

type Pages = 'members' | 'settings' | 'boards' | 'invites';

const PAGE_MAP: Array<Pages> = ['boards', 'members', 'settings', 'invites'];

const getPath = () => location.pathname.split('/').pop() || 'retros';
const getPathIndex = () => {
    const index = PAGE_MAP.findIndex(i => i === getPath());

    return index < 0 ? 0 : index;
};

export default function TeamDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { myTeams, loading } = useTeams();
    const [page, setPage] = useState(getPathIndex());
    const { teamId } = useParams<{ teamId: string; }>();

    const teamDetail = myTeams.find(({ id }) => id === teamId);

    useEffect(() => { setPage(getPathIndex()); }, [location]);

    const goTo = (tab: Pages) => { navigate(`/teams/${teamId}/${tab}`, { replace: false }); };

    return (
        <Page
            loading={loading}
            title={loading ? '' : teamDetail?.name}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={page} aria-label="basic tabs example">
                    <Tab
                        label="Retrôs"
                        iconPosition="start"
                        icon={<DashboardIcon />}
                        onClick={() => goTo('boards')}
                    />
                    <Tab
                        label="Time"
                        iconPosition="start"
                        icon={<GroupsIcon />}
                        onClick={() => goTo('members')}
                    />
                    <Tab
                        label="Configurações"
                        iconPosition="start"
                        icon={<SettingsIcon />}
                        onClick={() => goTo('settings')}
                    />
                    <Tab
                        label="Convites"
                        iconPosition="start"
                        icon={<LocalPostOfficeIcon />}
                        onClick={() => goTo('invites')}
                    />
                </Tabs>
            </Box>
            <Box>
                <Outlet />
            </Box>
        </Page>
    );
}