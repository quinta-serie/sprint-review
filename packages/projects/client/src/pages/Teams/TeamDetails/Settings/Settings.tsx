import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';

import TabPage from '@/layout/TabPage';
import { defaultTemplate } from '@/services/template';
import Form, { Control, FormControl, useForm } from '@/components/Form';

import useTeams from '../../useTeams';
import useTeamDetails from '../useTeamDetails';
import TemplateForm, { useTemplateForm, type TemplateFormData } from '../../TemplateForm';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ZoneProps { title: string; subtitle: string; children: React.JSX.Element; }
function Zone({ title, subtitle, children }: ZoneProps) {
    return (
        <Stack spacing={2}>
            <Typography variant="h5" color="text.primary">{title}</Typography>

            <Typography variant="subtitle2" color="text.primary">{subtitle}</Typography>

            {children}
        </Stack>
    );
}

function Loading() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
        </Box>
    );
}

function BasicInfo() {
    const { team, updateTeamName } = useTeamDetails();

    const [loading, setLoading] = useState(false);

    const [formGroup] = useForm<{ name: string; }>({
        form: {
            name: new FormControl({ value: team.name, required: true })
        },
        handle: {
            submit: (form) => {
                const { name } = form.values;

                setLoading(true);

                updateTeamName(name)
                    .then(() => {
                        setTimeout(() => { setLoading(false); }, 500);
                    });
            }
        }
    }, [team]);

    return (
        <Zone
            title="Informações"
            subtitle="Atualize as informações básicas do seu time."
        >
            <Form formGroup={formGroup}>
                <Stack spacing={2} sx={{ maxWidth: 350 }}>
                    <Box>
                        <Control controlName="name" >
                            <TextField
                                variant="outlined"
                                size="small"
                                disabled={loading}
                                defaultValue={team.name}
                                fullWidth
                            />
                        </Control>
                    </Box>
                    <Box>
                        <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? <CircularProgress size={24} />
                                    : 'Atualizar Nome'
                            }
                        </Button>
                    </Box>
                </Stack>
            </Form>
        </Zone>

    );
}

function DefaultBoardTeamplateConfig() {
    const [loading, setLoading] = useState(false);
    const { team, createTeamTemplate, updateTeamTemplate } = useTeamDetails();

    const submit = (data: TemplateFormData) => {
        setLoading(true);
        const newTemplate = { ...data, teamId: team.id, isDefault: true };

        if (team.defaultTemplate) {
            updateTeamTemplate({ ...newTemplate, id: team.defaultTemplate.id })
                .finally(() => setTimeout(() => { setLoading(false); }, 500));
            return;
        }

        createTeamTemplate(newTemplate)
            .finally(() => setTimeout(() => { setLoading(false); }, 500));
    };

    const templateFormGroup = useTemplateForm(defaultTemplate(team.id), submit);

    return (
        <Zone
            title="Configurações do Board Padrão"
            subtitle="Personalize as configurações padrão do seu board."
        >
            <Box sx={{ maxWidth: 350 }}>
                <TemplateForm formGroup={templateFormGroup}>
                    <Box>
                        <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Atualizar Template'}
                        </Button>
                    </Box>
                </TemplateForm>
            </Box>
        </Zone>
    );
}

interface ExcludeTeamDialogProps { open: boolean; onClose: () => void; }
function ExcludeTeamDialog({ open, onClose }: ExcludeTeamDialogProps) {
    const navigate = useNavigate();
    const { team, updateTeamState } = useTeamDetails();

    const [formGroup] = useForm<{ name: string }>({
        form: {
            name: new FormControl({ value: '', required: true })
        },
        handle: {
            submit: () => {
                updateTeamState()
                    .then(() => { navigate('/teams'); });
            }
        },
        validator: {
            name: (form) => {
                const { name } = form.values;

                if (!name) { return 'Este é um campo obrigatório'; }
                if (name !== team.name) { return 'Nome inválido'; }
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
            <DialogTitle>Cuidado! Essa é uma ação irreversível</DialogTitle>
            <Form formGroup={formGroup}>
                <DialogContent>
                    <Control controlName="name">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Digite o nome do time para confirmar"
                            error={formGroup.controls.name.isInvalid}
                            helperText={formGroup.controls.name.isInvalid && formGroup.controls.name.error}
                        />
                    </Control>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="error">Excluir</Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}

function Content() {
    const [open, setOpen] = useState(false);

    const toggleDialog = () => setOpen(!open);

    return (
        <Stack spacing={2}>
            <BasicInfo />

            <Divider />

            <DefaultBoardTeamplateConfig />

            <Divider />

            <Zone
                title="Zona perigosa"
                subtitle="Cuidado! Aqui você pode excluir o time."
            >
                <Box>
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={toggleDialog}
                    >
                        Excluir Time
                    </Button>
                </Box>
            </Zone>
            <ExcludeTeamDialog open={open} onClose={toggleDialog} />
        </Stack>
    );
}

export default function Settings() {
    const { loading } = useTeams();

    return (
        <TabPage>
            {
                loading
                    ? <Loading />
                    : <Content />
            }
        </TabPage>
    );
}