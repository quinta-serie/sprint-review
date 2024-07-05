import { useState } from 'react';

import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MuiFormGroup from '@mui/material/FormGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Zoom from '@mui/material/Zoom';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import TabPage from '@/layout/TabPage';
import { team, template } from '@/services/core';
import type { TemplateWithEditableData } from '@/services/template';
import Form, { Control, FormControl, FormGroup, useForm } from '@/components/Form';

import useTeams from '../../useTeams';

type TemplateForm = Omit<TemplateWithEditableData, 'id' | 'teamId' | 'isDefault'>;

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
                    members: newTeam?.members.map(m => m.email),
                    defaultTemplate: newTeam?.defaultTemplate.id,
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
                                defaultValue={selectedTeam?.name}
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

function InputColumns({ formGroup }: { formGroup: FormGroup<TemplateForm> }) {
    const [input, setInput] = useState('');

    const addColumn = () => { formGroup.setValues({ columns: [...formGroup.controls.columns.value, input] }); };

    const updateInput = (e: React.FormEvent<HTMLDivElement>) => { setInput(e.target['value']); };

    const handleDeleteColumn = (index: number) => {
        const columns = formGroup.controls.columns.value.filter((_, i) => i !== index);
        formGroup.setValues({ columns });
        setInput('');
    };

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom>Colunas</Typography>
            <OutlinedInput
                fullWidth
                size="small"
                value={input}
                placeholder="Ex: To Do, In Progress, Done"
                onInput={updateInput}
                sx={{ marginBottom: 2 }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            edge="end"

                            onClick={addColumn}
                        >
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
            <Box>
                {
                    formGroup.controls.columns.value.map((column, index) => (
                        <Zoom in key={index}>
                            <Chip
                                label={column}
                                variant="outlined"
                                sx={{ mr: 2, mb: 2 }}
                                onDelete={() => handleDeleteColumn(index)}
                                avatar={<Avatar>{index + 1}</Avatar>}
                            />
                        </Zoom>
                    ))
                }
            </Box>
        </Box>
    );
}

function DefaultBoardConfig() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const { selectedTeam, updateTeam } = useTeams();

    const {
        id,
        name,
        columns,
        oneVotePerCard,
        maxVotesPerCard,
        maxVotesPerUser,
        shouldShowCardsAutor,
        shouldHideCardsInitially
    } = selectedTeam.defaultTemplate;

    const [formGroup] = useForm<TemplateForm>({
        form: {
            name: new FormControl({ value: name, required: true }),
            columns: new FormControl({ value: columns }),
            oneVotePerCard: new FormControl({ value: oneVotePerCard }),
            maxVotesPerCard: new FormControl({ value: maxVotesPerCard }),
            maxVotesPerUser: new FormControl({ value: maxVotesPerUser }),
            shouldShowCardsAutor: new FormControl({ value: shouldShowCardsAutor }),
            shouldHideCardsInitially: new FormControl({ value: shouldHideCardsInitially }),
        },
        handle: {
            submit: (form) => {
                setLoading(true);
                const newTemplate = { ...form.values, teamId: selectedTeam.id, isDefault: true };

                if (id) {
                    template.updateTemplate({ ...newTemplate, id })
                        .then(() => {
                            updateTeam({ ...selectedTeam, defaultTemplate: { ...newTemplate, id } });
                            enqueueSnackbar('Template editado com sucesso!', { variant: 'success' });
                        })
                        .finally(() => setTimeout(() => { setLoading(false); }, 500));
                    return;
                }

                template.createTemplate(newTemplate)
                    .then((data) => {
                        updateTeam({ ...selectedTeam, defaultTemplate: data });
                        enqueueSnackbar('Template criado com sucesso!', { variant: 'success' });
                    })
                    .finally(() => setTimeout(() => { setLoading(false); }, 500));
            }
        }
    }, []);

    return (
        <Zone
            title="Configurações do Board Padrão"
            subtitle="Personalize as configurações padrão do seu board."
        >
            <Box sx={{ maxWidth: 350 }}>
                <Form formGroup={formGroup}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Nome do Board</Typography>
                            <Control controlName="name">
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    placeholder="Ex: Retrospectiva"
                                    value={formGroup.controls.name.value}
                                    error={formGroup.controls.name.isInvalid}
                                    helperText={formGroup.controls.name.isInvalid && formGroup.controls.name.error}
                                />
                            </Control>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Votos por pessoa</Typography>
                            <Control controlName="maxVotesPerUser" action="onChange">
                                <Slider
                                    marks
                                    min={1}
                                    max={10}
                                    shiftStep={1}
                                    defaultValue={formGroup.controls.maxVotesPerUser.value}
                                    valueLabelDisplay="auto"
                                />
                            </Control>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Configurações</Typography>
                            <MuiFormGroup>
                                <FormControlLabel
                                    label="Ocultar cards inicialmente"
                                    control={
                                        <Control
                                            type="checkbox"
                                            action="onChange"
                                            controlName="shouldHideCardsInitially"
                                        >
                                            <Switch checked={formGroup.controls.shouldHideCardsInitially.value} />
                                        </Control>
                                    }
                                />
                                <FormControlLabel
                                    label="Um voto por card"
                                    control={
                                        <Control
                                            type="checkbox"
                                            action="onChange"
                                            controlName="oneVotePerCard"
                                        >
                                            <Switch checked={formGroup.controls.oneVotePerCard.value} />
                                        </Control>
                                    }
                                />
                                <FormControlLabel
                                    label="Mostrar autor do card"
                                    control={
                                        <Control
                                            type="checkbox"
                                            action="onChange"
                                            controlName="shouldShowCardsAutor"
                                        >
                                            <Switch checked={formGroup.controls.shouldShowCardsAutor.value} />
                                        </Control>
                                    }
                                />
                            </MuiFormGroup>
                            <InputColumns formGroup={formGroup} />
                        </Box>
                        <Box>
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : 'Atualizar'}
                            </Button>
                        </Box>
                    </Stack>
                </Form>
            </Box>
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