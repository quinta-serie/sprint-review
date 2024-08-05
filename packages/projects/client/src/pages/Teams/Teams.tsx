import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Zoom from '@mui/material/Zoom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MuiFormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';

import Page from '@/layout/Page';
import debounce from '@/utils/debounce';
import type { TeamPopulated } from '@/services/team';
import Form, { Control, FormControl, useForm } from '@/components/Form';

import useTeams from './useTeams';
import TeamCard from './TeamCard';
import CreateTeamModal from './CreateTeamModal';
import { useInviteUserModal } from './InviteUserModal';

function SkeletonCards() {
    const arr = new Array(6).fill('');

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {
                    arr.map((e, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={e + i}>
                                <Skeleton variant="rectangular" sx={{ height: 182 }} />
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

interface EmptyContentProps { onOpenCreateModal: () => void; }
function EmptyContent({ onOpenCreateModal }: EmptyContentProps) {
    return (
        <Box sx={{ height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Stack textAlign="center" spacing={1}>
                <InventoryIcon sx={{ fontSize: 60 }} style={{ margin: 'auto' }} color="disabled" />
                <Typography variant="h6" component="h6">
                    Você ainda não está em nenhum time
                </Typography>
                <Typography variant="body1" component="h6">
                    Clique em "criar time" ou solicite que um membro do seu time te adicione
                </Typography>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={onOpenCreateModal}
                >
                    Criar time
                </Button>
            </Stack>
        </Box>
    );
}

interface ContentProps { onOpenCreateModal: () => void; onAddMember: (team: TeamPopulated) => void; }
function Content({ onOpenCreateModal }: ContentProps) {
    const { filter } = useTeams();

    return (
        filter.filtered.length ?
            <Grid container spacing={2}>
                {
                    filter.filtered
                        .map((team, index) =>
                            <Zoom in
                                key={team.id}
                                style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                            >
                                <Grid item xs={12} md={6} lg={4}>
                                    <TeamCard {...team} />
                                </Grid>
                            </Zoom>
                        )
                }
            </Grid>
            : <EmptyContent onOpenCreateModal={onOpenCreateModal} />
    );
}

export default function Teams() {
    const { filter, loading } = useTeams();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { InviteUserModal, toggleModal, isOpen, selectedTeam, updateTeamSelected } = useInviteUserModal();

    const [formGroup] = useForm<{ name: string }>({
        form: {
            name: new FormControl({ value: '', type: 'text' })
        },
        handle: {
            change: (form) => {
                const { name } = form.values;

                if (!form.controls.name.dirty) { return; }

                debounce.delay(() => {
                    if (name) {
                        filter.do((team) => team.name.toLowerCase().includes(name.toLowerCase()));
                    } else {
                        filter.reset();
                    }
                }, 500);
            }
        }
    }, []);

    const toggleCreateModal = () => { setShowCreateModal(prev => !prev); };

    const handleAddMember = (team: TeamPopulated) => {
        updateTeamSelected(team);
        toggleModal();
    };

    return (
        <Page
            title="Meus Times"
            action={
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={toggleCreateModal}
                >
                    Criar time
                </Button>
            }
        >
            <Stack spacing={2}>
                <Form formGroup={formGroup}>
                    <MuiFormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Busque pelo nome do time</InputLabel>
                        <Control controlName="name" action="onInput">
                            <OutlinedInput
                                label="Busque pelo nome do time"
                                placeholder="Ex: Navigation"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </Control>
                    </MuiFormControl>
                </Form>
                <Box>
                    {
                        loading
                            ? <SkeletonCards />
                            : <Content
                                onAddMember={handleAddMember}
                                onOpenCreateModal={toggleCreateModal}
                            />
                    }
                </Box>
                <CreateTeamModal
                    open={showCreateModal}
                    onClose={toggleCreateModal}
                />
                <InviteUserModal
                    open={isOpen}
                    onClose={toggleModal}
                    teamSelected={selectedTeam as TeamPopulated}
                />
            </Stack>
        </Page>
    );
}