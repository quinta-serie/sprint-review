import { forwardRef, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import MuiFormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TransitionProps } from '@mui/material/transitions';
import Zoom from '@mui/material/Zoom';

import GradeIcon from '@mui/icons-material/Grade';
import ArchiveIcon from '@mui/icons-material/Archive';
import DashboardIcon from '@mui/icons-material/Dashboard';

import TabPage from '@/layout/TabPage';
import { userServices } from '@/services/core';
import { defaultTemplate, TemplateData } from '@/services/template';
import Form, { useForm, Control, FormControl } from '@/components/Form';
import type { BoardData } from '@/services/board';
import useFilter from '@/hooks/useFilter';

import { CardBoard } from './CardBoard';
import useTeamDetails from '../useTeamDetails';
import TemplateForm, { useTemplateForm } from '../../TemplateForm';

interface CreateBoardForm { name: string; template: string; description: string; }

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function LoadingContent() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
        </Box>
    );
}

interface EmptyContentProps { toggleModal: () => void; }
function EmptyContent({ toggleModal }: EmptyContentProps) {
    return (
        <Box sx={{ height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Stack textAlign="center" spacing={1}>
                <DashboardIcon sx={{ fontSize: 60 }} style={{ margin: 'auto' }} color="disabled" />
                <Typography variant="h6" component="h6">
                    Seu time não tem nenhum board criado
                </Typography>
                <Typography variant="body1" component="h6">
                    Clique em "Adicionar Board" para começar
                </Typography>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={toggleModal}
                >
                    Adicionar Board
                </Button>
            </Stack>
        </Box>
    );
}

interface EmptyContentStatusProps { status: BoardData['status']; }
function EmptyContentStatus({ status }: EmptyContentStatusProps) {
    return (
        <Box sx={{ height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Stack textAlign="center" spacing={1}>
                <DashboardIcon sx={{ fontSize: 60 }} style={{ margin: 'auto' }} color="disabled" />
                <Typography variant="h6" component="h6">
                    {status === 'active' ? 'Nenhum board disponível' : 'Nenhum board arquivado'}
                </Typography>
            </Stack>
        </Box>
    );
}

interface ListCardBoardProps { boards: BoardData[]; }
function ListCardBoard({ boards }: ListCardBoardProps) {
    return (
        <Grid container spacing={3}>
            {
                boards.map((board, index) =>
                    <Zoom in
                        key={board.id}
                        style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                    >
                        <Grid item xs={12} sm={6} md={4}>
                            <CardBoard {...board} />
                        </Grid>
                    </Zoom>
                )
            }
        </Grid>

    );
}

interface WithContentProps { toggleModal: () => void; }
function WithContent({ toggleModal }: WithContentProps) {
    const { boards } = useTeamDetails();
    const [status, setStatus] = useState<BoardData['status']>('active');
    const { filtered, filter } = useFilter(boards, (data) => data.status === status);

    const handleAlignment = (_: React.MouseEvent<HTMLElement>, newStatus: BoardData['status']) => {
        setStatus(newStatus);
        filter((data) => data.status === newStatus);
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={status}
                    onChange={handleAlignment}
                >
                    <Tooltip title="Disponível">
                        <ToggleButton value="active">
                            <GradeIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title="Arquivado">
                        <ToggleButton value="archived">
                            <ArchiveIcon />
                        </ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={toggleModal}
                >
                    Criar Board
                </Button>
            </Box>
            {
                filtered.length
                    ? <ListCardBoard boards={filtered} />
                    : <Zoom in>
                        <Box>
                            <EmptyContentStatus status={status} />
                        </Box>
                    </Zoom>
            }
        </>
    );
}

function Content() {
    const [shouldOpenModal, setShouldOpenModal] = useState(false);
    const { boards, loading, getTeamTemplates } = useTeamDetails();

    useEffect(() => { getTeamTemplates(); }, []);

    const toggleModal = () => { setShouldOpenModal(!shouldOpenModal); };

    return (
        <Box>
            {
                boards.length
                    ? <WithContent toggleModal={toggleModal} />
                    : <EmptyContent toggleModal={toggleModal} />
            }
            {
                !loading.templates && <CreateBoardModal open={shouldOpenModal} onClose={toggleModal} />
            }
        </Box>
    );
}

interface CreateBoardModalProps { open: boolean; onClose: () => void; }
function CreateBoardModal({ open, onClose }: CreateBoardModalProps) {
    const [loading, setLoading] = useState(false);
    const { team, templates, createTeamBoard } = useTeamDetails();

    const user = userServices.current;

    const templateFormGroup = useTemplateForm(defaultTemplate(team.id));

    const [formGroup] = useForm<CreateBoardForm>({
        form: {
            name: new FormControl({ value: '', required: true }),
            description: new FormControl({ value: '' }),
            template: new FormControl({ value: team.defaultTemplate ? team.defaultTemplate.id : 'customizado' }),
        },
        handle: {
            submit: (form) => {
                if (!templateFormGroup.isValid) { return; }

                setLoading(true);

                const { name } = form.values;

                const template = form.values.template === 'customizado'
                    ? templateFormGroup.values
                    : templates.find(t => t.id === form.values.template) as TemplateData;

                createTeamBoard({
                    name,
                    cards: [],
                    teamId: team.id,
                    ownerId: user.user_id,
                    description: form.values.description,
                    template: { ...template, id: '', teamId: team.id, isDefault: false },
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                        onClose();
                    }, 500);
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
            <DialogTitle>Crie seu board</DialogTitle>
            <Form formGroup={formGroup}>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText>
                            Preencha os campos para criar um novo board
                        </DialogContentText>
                        <Control controlName="name">
                            <TextField
                                label="Nome"
                                variant="outlined"
                                error={formGroup.controls.name.isInvalid}
                                helperText={formGroup.controls.name.isInvalid && formGroup.controls.name.error}
                            />
                        </Control>
                        <Control controlName="description">
                            <TextField
                                rows={2}
                                multiline
                                label="Descrição"
                                variant="outlined"
                                error={formGroup.controls.description.isInvalid}
                                helperText={
                                    formGroup.controls.description.isInvalid && formGroup.controls.description.error
                                }
                            />
                        </Control>
                        <MuiFormControl fullWidth>
                            <InputLabel>Template</InputLabel>
                            <Control controlName="template" action="onChange">
                                <Select
                                    label="Template"
                                    defaultValue={formGroup.controls.template.value}
                                >
                                    {
                                        templates.map(template => (
                                            <MenuItem key={template.id} value={template.id}>
                                                {template.name}
                                            </MenuItem>
                                        ))
                                    }
                                    <MenuItem value="customizado">
                                        Customizado
                                    </MenuItem>
                                </Select>
                            </Control>
                        </MuiFormControl>
                        {
                            formGroup.values.template === 'customizado' && (
                                <TemplateForm shouldOmitName formGroup={templateFormGroup} />
                            )
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {
                            loading
                                ? <CircularProgress size={20} color="inherit" />
                                : 'Criar'
                        }
                    </Button>
                </DialogActions>
            </Form>
        </Dialog >
    );
}

export default function Boards() {
    const { loading, getTeamBoards } = useTeamDetails();

    useEffect(() => { if (!loading.details) { getTeamBoards(); } }, [loading.details]);

    return (
        <TabPage>
            {
                loading.details || loading.boards
                    ? <LoadingContent />
                    : <Content />
            }
        </TabPage>
    );
}