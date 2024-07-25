import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';

import TabPage from '@/layout/TabPage';
import { defaultTemplate } from '@/services/template';
import Form, { Control, FormControl, useForm } from '@/components/Form';

import useTeams from '../../useTeams';
import useTeamDetails from '../useTeamDetails';
import TemplateForm, { useTemplateForm, type TemplateFormData } from '../../TemplateForm';

interface ZoneProps { title: string; subtitle: string; children: React.JSX.Element; }
function Zone({ title, subtitle, children }: ZoneProps) {
    return (
        <Stack spacing={2}>
            <Typography variant="h5">{title}</Typography>

            <Typography variant="subtitle2">{subtitle}</Typography>

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

function Content() {
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
                        onClick={console.log}
                    >
                        Excluir Time
                    </Button>
                </Box>
            </Zone>
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