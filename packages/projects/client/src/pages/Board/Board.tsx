import { useParams } from 'react-router-dom';
import { forwardRef, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Zoom from '@mui/material/Zoom';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Chip, { ChipProps } from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import { TransitionProps } from '@mui/material/transitions';

import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import useModal from '@/hooks/useModal';
import { boardServices } from '@/services/core';
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
    return <div>Loading...</div>;
}

interface TemplateConfigDialogProps { open: boolean; onClose: () => void; }
function TemplateConfigDialog({ open, onClose }: TemplateConfigDialogProps) {
    const { board, updateTemplateConfig } = useBoard();

    const submit = (data: TemplateFormData) => {
        updateTemplateConfig(data);
        onClose();
    };

    const templateFormGroup = useTemplateForm(board.template, submit);

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
                <TemplateForm shouldOmitName shouldOmitColumns formGroup={templateFormGroup} >
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="primary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="secondary">Salvar</Button>
                    </Stack>
                </TemplateForm>
            </DialogContent>
        </Dialog>
    );
}

interface ListCardsProps { column: string; }
function ListCards({ column }: ListCardsProps) {
    const { board, mergeCards } = useBoard();

    const handleMerge = (origin: CardData, target: CardData) => {
        if (origin.id === target.id) { return; }

        mergeCards(origin, target);
    };

    return (
        board.cards
            .filter(card => card.column === column)
            .map((card, index) => (
                <Zoom in
                    key={card.id}
                    style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                >
                    <div>
                        <BoadCard {...card} />
                    </div>
                </Zoom>
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
                    <Grid key={column} item md={lengthGrids} width="100%">
                        <Typography variant="h6" gutterBottom>{column}</Typography>
                        <Stack direction="column" spacing={1}>
                            <Button
                                fullWidth
                                color="inherit"
                                variant="outlined"
                                onClick={() => handleAddCard(columnIndex)}
                            >
                                <ControlPointIcon />
                            </Button>
                            <ListCards column={column} />
                            <DialogCardText open={open} onClose={toggleDialog} index={index} action="create" />
                        </Stack>
                    </Grid>
                ))
            }
        </Grid >
    );
}

function Content() {
    const { board } = useBoard();
    const [openTemplateModal, toggleTemplateModal] = useModal();

    const MAP_STATUS: { [x in BoardData['status']]: { label: string, color: ChipProps['color'] } } = {
        active: { label: 'Ativo', color: 'success' },
        archived: { label: 'Arquivado', color: 'warning' },
    };

    const mappedStatus = MAP_STATUS[board.status];

    return (
        <Stack spacing={2} >
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5">{board.name}</Typography>
                <Chip
                    size="small"
                    variant="outlined"
                    label={mappedStatus.label}
                    color={mappedStatus.color}
                />
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="flex-end">
                <IconButton onClick={() => console.log('share')} >
                    <ShareIcon />
                </IconButton>
                <IconButton onClick={toggleTemplateModal} >
                    <SettingsIcon />
                </IconButton>
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
    const { board, loading, getBoardDetails, loadBoard: updateBoard } = useBoard();

    useEffect(() => { getBoardDetails(boardId as string); }, []);

    useEffect(() => {
        if (loading) { return; }

        const unsubscribe = boardServices.subscription(board.id, (data) => { updateBoard(() => data); });

        return () => unsubscribe();
    }, [loading]);

    return (
        <div>
            {
                loading
                    ? <Loading />
                    : <Content />
            }
        </div>
    );
}