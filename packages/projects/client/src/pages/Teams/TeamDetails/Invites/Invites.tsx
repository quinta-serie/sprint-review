import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';

import type { InviteData } from '@/services/invite';
import { invite } from '@/services/core';
import TabPage from '@/layout/TabPage';

import useTeams from '../../useTeams';

function TableLoading() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
        </Box>
    );
}

interface InvitesTableProps { invites: InviteData[]; onExclude: (invite: InviteData) => void; }
function InvitesTable({ invites, onExclude }: InvitesTableProps) {
    return (
        <TableContainer elevation={0} component={Paper}>
            <Table sx={{ minWidth: 650, border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
                <TableBody>
                    {
                        invites.map((row) => (
                            <TableRow key={row.email}>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar alt={row.email} src={row.email} />
                                    {row.email}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{
                                        gap: 2,
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}>
                                        <AccessAlarmsIcon />
                                        {row.createdAt}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Chip color="warning" label="Enviado" size="small" />
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        color="error"
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => onExclude(row)}
                                    >
                                        Excluir convite
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

interface ContentProps { invites: InviteData[]; onExclude: (invite: InviteData) => void; }
function Content({ invites, onExclude }: ContentProps) {
    return (
        invites.length
            ? <InvitesTable invites={invites} onExclude={onExclude} />
            : <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200
            }}>
                <p>Nenhum convite enviado</p>
            </Box>
    );
}

export default function Invites() {
    const [invites, setInvites] = useState<InviteData[]>([]);
    const { loading, selectedTeam } = useTeams();

    useEffect(() => { getTeamInvites(); }, [selectedTeam]);

    const handleExclude = (data: InviteData) => {
        // invite.
    };

    const getTeamInvites = () => {
        if (loading) { return; }

        invite.getTeamInvites(selectedTeam.id)
            .then(res => setInvites(res))
            .catch(console.error)
            .finally(() => console.log('done'));
    };

    return (
        <TabPage>
            <Box>
                {
                    loading
                        ? <TableLoading />
                        : <Content invites={invites} onExclude={handleExclude} />
                }
            </Box>
        </TabPage>
    );
}