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

import useTeamDetails from './useTeamDetails';

type Pages = 'members' | 'settings' | 'boards' | 'invites';

const PAGE_MAP: Array<Pages> = ['boards', 'members', 'invites', 'settings'];

const getPath = () => location.pathname.split('/').pop() || 'retros';
const getPathIndex = () => {
    const index = PAGE_MAP.findIndex(i => i === getPath());

    return index < 0 ? 0 : index;
};

export default function TeamDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getTeamDetails, loading, team } = useTeamDetails();
    const [page, setPage] = useState(getPathIndex());
    const { teamId } = useParams<{ teamId: string; }>();

    useEffect(() => { setPage(getPathIndex()); }, [location]);

    useEffect(() => { getTeamDetails(teamId as string); }, []);

    const goTo = (tab: Pages) => { navigate(`/teams/${teamId}/${tab}`, { replace: false }); };

    return (
        <Page
            loading={loading.details}
            title={loading.details ? '' : team.name}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={page}>
                    <Tab
                        label="Retrôs"
                        iconPosition="start"
                        icon={<DashboardIcon />}
                        onClick={() => goTo('boards')}
                    />
                    <Tab
                        label="Membros"
                        iconPosition="start"
                        icon={<GroupsIcon />}
                        onClick={() => goTo('members')}
                    />
                    <Tab
                        label="Convites"
                        iconPosition="start"
                        icon={<LocalPostOfficeIcon />}
                        onClick={() => goTo('invites')}
                    />
                    <Tab
                        label="Configurações"
                        iconPosition="start"
                        icon={<SettingsIcon />}
                        onClick={() => goTo('settings')}
                    />
                </Tabs>
            </Box>
            <Box>
                <Outlet />
            </Box>
        </Page>
    );
}