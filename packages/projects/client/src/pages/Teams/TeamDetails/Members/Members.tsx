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
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';

import DeleteIcon from '@mui/icons-material/Delete';

import TabPage from '@/layout/TabPage';
import { team } from '@/services/core';
import type { UserData } from '@/services/user';
import Form, { Control, useForm, FormControl } from '@/components/Form';
import log from '@/utils/log';

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

                team.updateMemberToTeam({
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

interface MembersTableProps { onSelect: (user: UserData) => void; }
function MembersTable({ onSelect }: MembersTableProps) {
    const { selectedTeam } = useTeams();

    return (
        <TableContainer elevation={0} component={Paper}>
            <Table sx={{ minWidth: 650, border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
                <TableBody>
                    {
                        selectedTeam?.members.map((row) => (
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

export default function Members() {
    const { loading } = useTeams();
    const [open, setOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<UserData>();

    const handleToggle = () => { setOpen(prev => !prev); };

    const handleSelectUser = (user: UserData) => {
        setSelectedMember(user);
        handleToggle();
    };

    return (
        <TabPage>
            <Box>
                {
                    loading
                        ? 'loading...'
                        : <MembersTable onSelect={handleSelectUser} />
                }
                <DeleteMemberModal
                    open={open}
                    selectedMember={selectedMember}
                    onClose={handleToggle}
                />
            </Box>
        </TabPage>
    );
}