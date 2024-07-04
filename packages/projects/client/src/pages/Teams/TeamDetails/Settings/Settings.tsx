import { useState } from 'react';

import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiFormGroup from '@mui/material/FormGroup';

import DeleteIcon from '@mui/icons-material/Delete';

import { team } from '@/services/core';
import TabPage from '@/layout/TabPage';
import Form, { Control, FormControl, useForm } from '@/components/Form';

import useTeams from '../../useTeams';

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
    const { enqueueSnackbar } = useSnackbar();
    const { selectedTeam, updateTeam } = useTeams();

    const [loading, setLoading] = useState(false);

    const [formGroup] = useForm<{ name: string; }>({
        form: {
            name: new FormControl({ value: selectedTeam?.name, required: true })
        },
        handle: {
            submit: (form) => {
                const { name } = form.values;
                const newTeam = { ...selectedTeam, name };

                setLoading(true);

                team.updateTeam({
                    ...newTeam,
                    name,
                    admin: newTeam?.admin.email,
                    members: newTeam?.members.map(m => m.email)
                }).then(() => {
                    setTimeout(() => {
                        updateTeam(newTeam);
                        enqueueSnackbar('Nome do time atualizado!', { variant: 'success' });
                        setLoading(false);
                    }, 500);
                });
            }
        }
    }, [selectedTeam]);

    return (
        <Zone
            title="Informações Básicas"
            subtitle="Atualize as informações básicas do seu time."
        >
            <Form formGroup={formGroup}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Control controlName="name" >
                        <TextField
                            variant="outlined"
                            size="small"
                            disabled={loading}
                            defaultValue={selectedTeam?.name}
                            sx={{ width: 300 }}
                        />
                    </Control>
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
            </Form>
        </Zone>

    );
}

function DefaultBoardConfig() {
    // const [] = useForm({

    // });

    return (
        <Zone
            title="Configurações do Board Padrão"
            subtitle="Personalize as configurações padrão do seu board."
        >
            <MuiFormGroup>
                <FormControlLabel control={<Switch />} label="Ocultar cards inicialmente" />
                <FormControlLabel control={<Switch />} label="Um voto por card" />
                <FormControlLabel control={<Switch />} label="Mostrar autor do card" />
            </MuiFormGroup>
        </Zone>
    );
}

function Content() {
    return (
        <Stack spacing={2}>
            <BasicInfo />

            <Divider />

            <DefaultBoardConfig />

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