import { forwardRef, useState } from 'react';

import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import type { TransitionProps } from '@mui/material/transitions';

import { userServices } from '@/services/core';
import Form, { useForm, Control, FormControl } from '@/components/Form';

import useTeams from './useTeams';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface CreateTeamModalProps { onClose: () => void, open: boolean }
export default function CreateTeamModal({ open, onClose }: CreateTeamModalProps) {
    const { addTeam } = useTeams();
    const [loading, setLoading] = useState(false);

    const [formControl] = useForm<{ name: string }>({
        form: {
            name: new FormControl({ value: '', type: 'text', required: true })
        },
        handle: {
            submit: (form) => {
                setLoading(true);

                const { name } = form.values;
                const { email } = userServices.current;

                addTeam(name, email)
                    .finally(() => {
                        setLoading(false);
                        onClose();
                    });
            }
        }
    }, []);

    return (
        <Dialog
            fullWidth
            keepMounted
            open={open}
            maxWidth="sm"
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Criar time</DialogTitle>
            <Form formGroup={formControl}>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText>
                            Escolha o nome do time
                        </DialogContentText>
                        <Control controlName="name">
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Ex: Navigation"
                                error={formControl.controls.name.isInvalid}
                                helperText={formControl.controls.name.isInvalid && formControl.controls.name.error}
                            />
                        </Control>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined">Cancelar</Button>
                    <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        sx={{ width: 111, height: 36 }}
                    >
                        {
                            loading
                                ? <CircularProgress size={20} color="inherit" />
                                : 'Criar'
                        }
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}