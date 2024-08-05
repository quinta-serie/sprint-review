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
import debounce from '@/utils/debounce';
import useFilter from '@/hooks/useFilter';
import type { UserData } from '@/services/user';
import type { TeamPopulated } from '@/services/team';
import Form, { Control, useForm, FormControl } from '@/components/Form';

import useTeamDetails from '../useTeamDetails';

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
    const { team, deleteMember } = useTeamDetails();

    const [formGroup] = useForm<{ email: string }>({
        form: {
            email: new FormControl({ value: '', type: 'email' })
        },
        handle: {
            submit: (form) => {
                if (!team) { return; }

                setLoading(true);

                const { email } = form.values;

                deleteMember(email)
                    .then(() => {
                        enqueueSnackbar('Membro excluído com sucesso.', { variant: 'success' });
                    }).catch(e => {
                        log.error(e);
                        enqueueSnackbar('Erro ao excluir membro.', { variant: 'error' });
                    }).finally(() => {
                        onClose();
                        setTimeout(() => { setLoading(false); }, 500);
                    });
            }
        },
        validator: {
            email: (form) => {
                const { email } = form.values;

                if (email !== selectedMember?.email) {
                    return 'O email informado não é o mesmo do membro selecionado.';
                }

                if (team && team.admin.email === email) {
                    return 'Você não pode excluir o dono do time.';
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
    const { team } = useTeamDetails();

    return (
        <TableContainer elevation={0} component={Paper}>
            <Table sx={{
                minWidth: 650,
                border: ({ palette }) => palette.mode === 'light'
                    ? `1px solid ${palette.grey[300]}`
                    : `1px solid ${palette.grey[800]}`
            }}>
                <TableBody>
                    {
                        members.map((row) => (
                            <TableRow key={row.email}>
                                <TableCell>
                                    <Avatar alt={row.name} src={row.picture} />
                                </TableCell>
                                <TableCell>
                                    {team.admin.email === row.email ? 'Admin' : 'Membro'}
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
    const { team, loading } = useTeamDetails();
    const [open, setOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<UserData>();
    const { filtered, filter, reset } = useFilter(team.members);

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
                    loading.details
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