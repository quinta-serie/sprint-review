import { useState, forwardRef, useEffect } from 'react';

import { enqueueSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import MuiFormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import type { TransitionProps } from '@mui/material/transitions';

import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import useKey from '@/hooks/useKey';
import { inviteServices, url } from '@/services/core';
import { validator } from '@/components/Form';
import type { TeamPopulated } from '@/services/team';
import type { InviteData } from '@/services/invite';

import useTeamDetails from '../TeamDetails/useTeamDetails';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface InviteUserModalProps { teamSelected: TeamPopulated; open: boolean; onClose: () => void, }
export default function InviteUserModal({ teamSelected, open, onClose }: InviteUserModalProps) {
    const { addInvites } = useTeamDetails();
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);
    const [input, setInput] = useState({ value: '', error: '' });

    const inviteLink = teamSelected ? `${url.origin}/to-invite/${teamSelected.id}` : '';

    useKey({ Enter: () => { addEmail(); } }, [input]);

    useEffect(() => { if (!open) { setEmails([]); } }, [open]);

    const addEmail = () => {
        const { value } = input;

        if (!value) {
            setInput(prev => ({ ...prev, error: 'Email é um campo obrigatório' }));
            return;
        }

        if (!validator.isValidEmail(value)) {
            setInput(prev => ({ ...prev, error: 'Este não é um email inválido' }));
            return;
        }

        if (emails.includes(value)) {
            setInput(prev => ({ ...prev, error: 'Este email já foi adicionado' }));
            return;
        }

        setEmails(prev => [...prev, value]);
        setInput({ value: '', error: '' });
    };

    const updateInput = (e: React.FormEvent<HTMLDivElement>) => {
        setInput(prev => ({ ...prev, value: e.target['value'], }));
    };

    const handleAddMembers = () => {
        if (!emails.length) {
            setInput(prev => ({ ...prev, error: 'Você precisa adicionar emails para enviar um convite' }));
            return;
        }

        setLoading(true);

        const promiseArr = emails.map(email => inviteServices.sendInvite({
            email,
            teamId: teamSelected.id,
            teamName: teamSelected.name
        }));

        Promise.all(promiseArr)
            .then((r) => {
                addInvites(r as InviteData[]);
                enqueueSnackbar('Convites enviados com sucesso!', { variant: 'success' });
            })
            .catch(() => { enqueueSnackbar('Oops! Tivemos um problema ao enviar os convites', { variant: 'error' }); })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    return (
        <Dialog
            fullWidth
            keepMounted
            open={open}
            maxWidth="sm"
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Convide pessoas para o time</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText>
                        Envie o link de acesso
                    </DialogContentText>
                    <MuiFormControl variant="outlined">
                        <OutlinedInput
                            readOnly
                            value={inviteLink}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => ''}
                                        edge="end"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </MuiFormControl>
                    <Divider />
                    <DialogContentText>
                        Convidar por email
                    </DialogContentText>
                    <OutlinedInput
                        fullWidth
                        placeholder="Email"
                        value={input.value}
                        onInput={updateInput}
                        error={Boolean(input.error)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    type="submit"
                                    onClick={addEmail}
                                >
                                    <AddIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {
                        Boolean(input.error) &&
                        <FormHelperText error>{input.error}</FormHelperText>
                    }
                    <Box>
                        {
                            emails.map((email) =>
                                <Zoom in key={email}>
                                    <Chip
                                        label={email}
                                        sx={{ mr: 2 }}
                                        onDelete={() => setEmails(prev => prev.filter(e => e !== email))}
                                    />
                                </Zoom>
                            )
                        }
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancelar</Button>
                <Button onClick={handleAddMembers} variant="contained">
                    {
                        loading
                            ? <CircularProgress size={20} color="inherit" />
                            : 'Convidar'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}