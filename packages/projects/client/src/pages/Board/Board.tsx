import { useTimer } from 'react-timer-hook';
import { useParams } from 'react-router-dom';
import { forwardRef, useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Chip, { ChipProps } from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';

import ShareIcon from '@mui/icons-material/Share';
import TimerIcon from '@mui/icons-material/Timer';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { slug } from '@/utils/string';
import useModal from '@/hooks/useModal';
import { addMinutes, addSeconds } from '@/utils/time';
import { boardServices } from '@/services/core';
import AlertBell from '@/assets/audio/bell-alert.mp3';
import type { BoardData, CardData } from '@/services/board';

import useBoard from './useBoard';
import BoadCard from './BoardCard';
import DialogCardText from './DialogCard';
import TemplateForm, { type TemplateFormData, useTemplateForm } from '../Teams/TemplateForm';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Loading() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
            <CircularProgress />
        </Box>
    );
}

interface TemplateConfigDialogProps { open: boolean; onClose: () => void; }
function TemplateConfigDialog({ open, onClose }: TemplateConfigDialogProps) {
    const { board, updateTemplateConfig, loading } = useBoard();

    const submit = (data: TemplateFormData) => {
        let expiryDate = '';

        if (data.timer) { expiryDate = addSeconds(new Date(), data.timer).toISOString(); }

        updateTemplateConfig({ ...data, timer: { isRunning: !!data.timer, expiryDate } })
            .finally(onClose);
    };

    const templateFormGroup = useTemplateForm(board.template, submit);

    useEffect(() => {
        if (!loading && !open) {
            templateFormGroup.setValues({
                name: board.template.name,
                columns: board.template.columns,
                maxVotesPerCard: board.template.maxVotesPerCard,
                maxVotesPerUser: board.template.maxVotesPerUser,
                hideCardsAutor: board.template.hideCardsAutor,
                hideCardsInitially: board.template.hideCardsInitially,
            });
        }
    }, [open]);

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
            <DialogContent>
                <TemplateForm shouldOmitName shouldOmitColumns shouldOmitTimer={false} formGroup={templateFormGroup}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="primary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="secondary">Salvar</Button>
                    </Stack>
                </TemplateForm>
            </DialogContent>
        </Dialog>
    );
}

interface MergeConfirmationDialogProps { origin: CardData; target: CardData; open: boolean; onClose: () => void; }
function MergeConfirmationDialog({ origin, target, open, onClose }: MergeConfirmationDialogProps) {
    const { mergeCards } = useBoard();

    const handleMerge = () => {
        mergeCards(origin, target);
        onClose();
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
            <DialogTitle>
                Essa é uma ação irreversível!
            </DialogTitle>
            <DialogContent>
                Tem certeza que deseja juntar os cards?
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained" onClick={onClose}>Não, deixa como está!</Button>
                <Button color="secondary" variant="contained" onClick={handleMerge}>Sim, Juntar!</Button>
            </DialogActions>
        </Dialog>
    );
}

interface ListCardsProps { column: string; }
function ListCards({ column }: ListCardsProps) {
    const { board } = useBoard();

    return (
        board.cards[column]
            .map((card, index) => (
                <Draggable
                    key={card.id}
                    index={index}
                    draggableId={card.id}
                >
                    {(provided) => (
                        <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <BoadCard {...card} />
                        </div>
                    )}
                </Draggable>
            ))
    );
}

function Columns() {
    const { board } = useBoard();
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const lengthGrids = 12 / board.template.columns.length;

    const toggleDialog = () => { setOpen(prev => !prev); };

    const handleAddCard = (index: number) => {
        setIndex(index);
        toggleDialog();
    };

    return (
        <Grid container spacing={2}>
            {
                board.template.columns.map((column, columnIndex) => (
                    <Grid
                        item
                        width="100%"
                        key={column}
                        md={lengthGrids}
                    >
                        <Typography variant="h6" color="text.primary" gutterBottom>{column}</Typography>
                        <Stack direction="column" spacing={1}>
                            <Button
                                fullWidth
                                sx={{
                                    color: ({ palette }) => palette.mode === 'light'
                                        ? palette.text.primary
                                        : palette.text.primary,
                                    border: ({ palette }) => palette.mode === 'light'
                                        ? `1px solid ${palette.grey[300]}`
                                        : `1px solid ${palette.grey[800]}`
                                }}
                                variant="outlined"
                                onClick={() => handleAddCard(columnIndex)}
                            >
                                <ControlPointIcon />
                            </Button>
                            <Droppable droppableId={column} isCombineEnabled>
                                {(provided) => (
                                    <Stack direction="column" spacing={1}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{ minHeight: 'calc(100vh - 310px)' }}
                                    >
                                        <ListCards column={slug(column)} />
                                        {provided.placeholder}
                                    </Stack>
                                )}
                            </Droppable>
                            <DialogCardText open={open} onClose={toggleDialog} index={index} action="create" />
                        </Stack>
                    </Grid>

                ))
            }
        </Grid >
    );
}

function Content() {
    const { enqueueSnackbar } = useSnackbar();
    const { board, removeTimer, isOwner } = useBoard();

    const { seconds, minutes, hours, pause, restart, isRunning } = useTimer({
        expiryTimestamp: new Date(board.timer?.expiryDate || ''),
        onExpire: () => {
            removeTimer()
                .then(() => {
                    enqueueSnackbar('Tempo esgotado!', { variant: 'info' });
                    new Audio(AlertBell).play();
                });
        }
    });

    const [openTemplateModal, toggleTemplateModal] = useModal();

    const MAP_STATUS: { [x in BoardData['status']]: { label: string, color: ChipProps['color'] } } = {
        active: { label: 'Ativo', color: 'success' },
        archived: { label: 'Arquivado', color: 'warning' },
    };

    const mappedStatus = MAP_STATUS[board.status];

    useEffect(() => { restart(new Date(board.timer?.expiryDate || ''), true); }, [board]);

    const handleRemoveTimer = () => {
        removeTimer().then(() => {
            pause();
            restart(new Date(), true);
        });
    };

    return (
        <Stack spacing={2} >
            <Stack direction="row" justifyContent="space-between" sx={{ minHeight: 40 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h5" color="text.primary">{board.name}</Typography>
                    <Chip
                        size="small"
                        variant="outlined"
                        label={mappedStatus.label}
                        color={mappedStatus.color}
                    />
                </Stack>
                {
                    board.timer?.expiryDate && isRunning && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            {
                                isOwner && (
                                    <Tooltip title="Remover contador regressivo" placement="left">
                                        <IconButton aria-label="remove timer" onClick={handleRemoveTimer}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                            <TimerIcon sx={{ color: 'text.primary' }} />
                            <Typography variant="h6" color="text.primary">
                                {hours.toString().padStart(2, '0')}:
                                {minutes.toString().padStart(2, '0')}:
                                {seconds.toString().padStart(2, '0')}
                            </Typography>
                        </Stack>
                    )
                }
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="flex-end">
                <IconButton onClick={() => console.log('share')} >
                    <ShareIcon />
                </IconButton>
                {
                    isOwner && (
                        <IconButton onClick={toggleTemplateModal} >
                            <SettingsIcon />
                        </IconButton>
                    )
                }
            </Stack>
            <Box>
                <Columns />
                <TemplateConfigDialog open={openTemplateModal} onClose={toggleTemplateModal} />
            </Box>
        </Stack>
    );
}

export default function Board() {
    const { boardId } = useParams<{ boardId: string; }>();
    const [open, setOpen] = useState(false);
    const [cardsReference, setCardsReference] = useState<{ origin: CardData; target: CardData }>();
    const { board, loading, getBoardDetails, loadBoard, changeCardPosition } = useBoard();

    useEffect(() => { getBoardDetails(boardId as string); }, []);

    useEffect(() => {
        if (loading) { return; }

        const unsubscribe = boardServices.subscription(board.id, (data) => { loadBoard(() => data); });

        return () => unsubscribe();
    }, [loading]);

    const toggleMergeDialog = () => { setOpen(prev => !prev); };

    const onDragEnd = (result: DropResult) => {
        const { droppableId } = result.source;
        const column = result.destination?.droppableId as string;

        const origin = board.cards[slug(droppableId)].find(card => card.id === result.draggableId) as CardData;

        // dropped in another card
        if (result.combine) {
            const target = board.cards[slug(result.combine?.droppableId)]
                .find(card => card.id === result.combine?.draggableId) as CardData;

            setCardsReference({ origin, target });
            toggleMergeDialog();

            return;
        }

        // dropped outside the list
        if (!result.destination) { return; }

        // dropped in the same position
        if (result.destination.index === result.source.index && origin.column === column) { return; }

        // dropped in another position
        changeCardPosition(origin, result.destination.index, column);
    };

    return (
        <div>
            {
                loading
                    ? <Loading />
                    : (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Content />
                            <MergeConfirmationDialog
                                open={open}
                                origin={cardsReference?.origin as CardData}
                                target={cardsReference?.target as CardData}
                                onClose={toggleMergeDialog}
                            />
                        </DragDropContext>
                    )
            }
        </div>
    );
}