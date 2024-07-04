import { forwardRef, useState } from 'react';

import { enqueueSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import MuiFormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import { Typography } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

import log from '@/utils/log';
import TabPage from '@/layout/TabPage';
import { team } from '@/services/core';
import debounce from '@/utils/debounce';
import useFilter from '@/hooks/useFilter';
import type { UserData } from '@/services/user';
import type { TeamPopulated } from '@/services/team';
import Form, { Control, useForm, FormControl } from '@/components/Form';

import useTeams from '../../useTeams';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteMemberModalProps { open: boolean; selectedMember?: UserData; onClose: () => void; }
function DeleteMemberModal({ open, selectedMember, onClose }: DeleteMemberModalProps) {
    const [loading, setLoading] = useState(false);
    const { selectedTeam, myTeams, updateTeams } = useTeams();

    const [formGroup] = useForm<{ email: string }>({
        form: {
            email: new FormControl({ value: '' })
        },
        handle: {
            submit: (form) => {
                if (!selectedTeam) { return; }

                setLoading(true);

                const { values } = form;

                team.updateTeam({
                    ...selectedTeam,
                    admin: selectedTeam.admin.email,
                    members: selectedTeam.members
                        .filter(m => m.email !== values.email)
                        .map(m => m.email)
                })
                    .then(() => {
                        enqueueSnackbar('Membro excluído com sucesso.', { variant: 'success' });

                        const teamWithOutMember = myTeams.map(t => {
                            if (t.id === selectedTeam.id) {
                                return {
                                    ...selectedTeam,
                                    members: selectedTeam.members.filter(m => m.email !== values.email)
                                };
                            }

                            return t;
                        });

                        updateTeams(teamWithOutMember);
                    })
                    .catch(e => {
                        log.error(e);
                        enqueueSnackbar('Erro ao excluir membro.', { variant: 'error' });
                    })
                    .finally(() => {
                        onClose();
                        setTimeout(() => { setLoading(false); }, 500);
                    });
            }
        },
        validator: {
            email: (form) => {
                const { email } = form.values;

                if (email !== selectedMember?.email) {
                    form.controls.email.error = 'O email informado não é o mesmo do membro selecionado.';
                } else {
                    form.controls.email.error = '';
                }
            },
            owner: (form) => {
                const { email } = form.values;

                if (selectedTeam && selectedTeam.admin.email === email) {
                    form.controls.email.error = 'Você não pode excluir o dono do time.';
                } else {
                    form.controls.email.error = '';
                }
            }
        }
    }, []);

    return (
        <Dialog
            keepMounted
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Exclusão de membro</DialogTitle>
            <Form formGroup={formGroup}>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText>
                            Para excluir o membro "{selectedMember?.name}" digite o email no campo abaixo.
                        </DialogContentText>
                        <Control controlName="email">
                            <TextField
                                fullWidth
                                variant="outlined"
                                error={formGroup.controls.email.isInvalid}
                                label={`Digite o email de "${selectedMember?.email}"`}
                                helperText={formGroup.controls.email.isInvalid && formGroup.controls.email.error}
                            />
                        </Control>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                    >
                        {
                            loading
                                ? <CircularProgress size={20} color="inherit" />
                                : 'Excluir'
                        }
                    </Button>
                </DialogActions>
            </Form>
        </Dialog >
    );
}

interface TableMembersProps { members: TeamPopulated['members']; onSelect: (user: UserData) => void; }
function TableMembers({ members, onSelect }: TableMembersProps) {
    return (
        <TableContainer elevation={0} component={Paper}>
            <Table sx={{ minWidth: 650, border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
                <TableBody>
                    {
                        members.map((row) => (
                            <TableRow key={row.email}>
                                <TableCell>
                                    <Avatar alt={row.name} src={row.picture} />
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onSelect(row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function TableLoading() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
        </Box>
    );
}

export default function Members() {
    const { loading } = useTeams();
    const { selectedTeam } = useTeams();
    const [open, setOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<UserData>();
    const { filtered, filter, reset } = useFilter(selectedTeam?.members);

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
                        filter((team) => team.name.toLowerCase().includes(name.toLowerCase()));
                    } else {
                        reset();
                    }
                }, 500);
            }
        }
    }, []);

    const handleToggle = () => { setOpen(prev => !prev); };

    const handleSelectUser = (user: UserData) => {
        setSelectedMember(user);
        handleToggle();
    };

    return (
        <TabPage>
            <Stack spacing={2}>
                <Form formGroup={formGroup}>
                    <MuiFormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Busque pelo nome do usuário</InputLabel>
                        <Control controlName="name" action="onInput">
                            <OutlinedInput
                                label="Busque pelo nome do usuário"
                                placeholder="Ex: João das Neves"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </Control>
                    </MuiFormControl>
                </Form>
                {
                    loading
                        ? <TableLoading />
                        : filtered.length
                            ? <TableMembers members={filtered} onSelect={handleSelectUser} />
                            : <Typography variant="body1" align="center">
                                Nenhum membro encontrado.
                            </Typography>
                }
                <DeleteMemberModal
                    open={open}
                    selectedMember={selectedMember}
                    onClose={handleToggle}
                />
            </Stack>
        </TabPage>
    );
}