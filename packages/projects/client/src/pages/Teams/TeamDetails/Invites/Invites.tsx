import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Chip, { type ChipProps } from '@mui/material/Chip';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';

import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';

import TabPage from '@/layout/TabPage';
import type { InviteData, InviteStatus } from '@/services/invite';

import useInvites from './useInvites';
import useTeams from '../../useTeams';
import { useInviteUserModal } from '../../InviteUserModal';

function TableLoading() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
        </Box>
    );
}

function TableRowItem(inviteData: InviteData) {
    const [loading, setLoading] = useState(false);
    const { excludeInvite } = useInvites();

    const { createdAt, email, status } = inviteData;

    const MAP_STATUS: { [x in InviteStatus]: { color: ChipProps['color']; label: string; } } = {
        sent: { label: 'Enviado', color: 'info' },
        accepted: { label: 'Aceito', color: 'success' },
        deleted: { label: 'Excluído', color: 'error' },
        rejected: { label: 'Rejeitado', color: 'warning' },
    };

    const handleExclue = () => {
        setLoading(true);

        excludeInvite(inviteData)
            .finally(() => setTimeout(() => { setLoading(false); }, 500));
    };

    return (
        <TableRow>
            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar alt={email} src={email} />
                {email}
            </TableCell>
            <TableCell>
                <Box sx={{
                    gap: 2,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <AccessAlarmsIcon />
                    {new Date(createdAt).toLocaleString()}
                </Box>
            </TableCell>
            <TableCell align="right">
                <Chip
                    size="small"
                    label={MAP_STATUS[status]['label']}
                    color={MAP_STATUS[status]['color']}
                />
            </TableCell>
            <TableCell align="right">
                <Button
                    color="error"
                    size="small"
                    variant="outlined"
                    disabled={status !== 'sent'}
                    startIcon={
                        loading ? '' : <DeleteIcon />
                    }
                    onClick={handleExclue}
                >
                    {
                        loading
                            ? <CircularProgress size={20} color="inherit" />
                            : 'Excluir'
                    }
                </Button>
            </TableCell>
        </TableRow>
    );
}

function InvitesTable() {
    const { pagination: { paginated } } = useInvites();

    return (
        <Box sx={{ minHeight: 367 }}>
            <TableContainer elevation={0} component={Paper}>
                <Table sx={{ minWidth: 650, border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
                    <TableBody>
                        {
                            paginated.map((row) => <TableRowItem key={row.id} {...row} />)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function WithContent() {
    const { toggleModal } = useInviteUserModal();
    const { pagination: { totalPages, paginate } } = useInvites();

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => { paginate(value); };

    return (
        <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={toggleModal}
                >
                    Adicionar membro
                </Button>
            </Box>
            <InvitesTable />
            <Box sx={{ display: 'flex' }}>
                <Pagination
                    color="primary"
                    count={totalPages}
                    variant="text"
                    sx={{ margin: 'auto' }}
                    onChange={handleChange}
                />
            </Box>
        </Stack>
    );
}

function EmptyContent() {
    const { toggleModal } = useInviteUserModal();

    return (
        <Box sx={{ height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Stack textAlign="center" spacing={1}>
                <InventoryIcon sx={{ fontSize: 60 }} style={{ margin: 'auto' }} color="disabled" />
                <Typography variant="h6" component="h6">
                    Seu time não tem nenhum convite enviado
                </Typography>
                <Typography variant="body1" component="h6">
                    Clique em "Adicionar membro" para enviar um novo convite
                </Typography>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={toggleModal}
                    startIcon={<PersonAddIcon />}
                >
                    Adicionar membro
                </Button>
            </Stack>
        </Box>
    );
}

function Content() {
    const { invites } = useInvites();
    const { selectedTeam } = useTeams();
    const { InviteUserModal, toggleModal, isOpen } = useInviteUserModal();

    return (
        <Box>
            {
                invites.length
                    ? <WithContent />
                    : <EmptyContent />
            }
            <InviteUserModal
                open={isOpen}
                onClose={toggleModal}
                teamSelected={selectedTeam}
            />
        </Box>
    );
}

export default function Invites() {
    const { loading } = useTeams();
    const { loadingInvites } = useInvites();

    return (
        <TabPage>
            <Box>
                {
                    loading && loadingInvites
                        ? <TableLoading />
                        : <Content />
                }
            </Box>
        </TabPage>
    );
}