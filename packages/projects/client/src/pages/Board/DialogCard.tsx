import { forwardRef, useState } from 'react';

import EmojiPicker, { Theme, EmojiStyle, EmojiClickData } from 'emoji-picker-react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import type { TransitionProps } from '@mui/material/transitions';

import MoodIcon from '@mui/icons-material/Mood';

import { uuid } from '@/utils/uuid';
import { CardData } from '@/services/board';
import { userServices } from '@/services/core';
import Form, { useForm, FormControl, Control } from '@/components/Form';

import useBoard from './useBoard';

interface AddCardForm { text: string; color: string; }

const COLORS = ['#2C4AC9', '#FF772A', '#A63EB9', '#009886'];

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTransparent = styled(Dialog)(() => ({
    '& .MuiDialog-paperScrollPaper': {
        background: 'transparent',
        boxShadow: 'none',
    },
    '& .MuiDialogContent-root': {
        border: 'none'
    },
}));

interface EmojiDialogProps { open: boolean; onClose: () => any; onAddEmoji: (emoji: string) => any; }
function EmojiDialog({ open, onClose, onAddEmoji }: EmojiDialogProps) {

    const onClick = (e: EmojiClickData) => {
        onAddEmoji(e.emoji);
        onClose();
    };

    return (
        <DialogTransparent open={open} onClose={onClose}>
            <DialogContent
                dividers
                sx={{ height: '100%', background: 'transparent' }}
            >
                <EmojiPicker
                    skinTonesDisabled
                    theme={Theme.LIGHT}
                    emojiVersion="0.6"
                    onEmojiClick={onClick}
                    autoFocusSearch={true}
                    emojiStyle={EmojiStyle.NATIVE}
                />
            </DialogContent>
        </DialogTransparent>
    );
}

interface DialogCardTextProps {
    card?: CardData;
    open: boolean;
    action: 'create' | 'edit',
    onClose: () => void; index?: number;
}
export default function DialogCardText({ open, action, index, card, onClose }: DialogCardTextProps) {
    const { board, addCard, editCardText } = useBoard();
    const [emojiModal, setEmojiModal] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);

    const { user_id, name } = userServices.current;

    const currentColor = index !== undefined ? COLORS[index] : card?.color as string;
    const column = index !== undefined ? board.template.columns[index] : card?.column as string;

    const [formGroup] = useForm<AddCardForm>({
        form: {
            text: new FormControl({ value: card ? card.text : '', required: true }),
            color: new FormControl({ value: currentColor, required: true }),
        },
        handle: {
            submit: (form) => {
                const { text, color } = form.values;

                const buildText = text.replace(/\n/g, '/n');

                action === 'edit'
                    ? editCardText(card?.id as string, buildText)
                        .finally(() => { handleClose(); })
                    : addCard({
                        color,
                        column,
                        id: uuid(),
                        whoLiked: [],
                        text: buildText,
                        owner: { id: user_id, name }
                    }).finally(() => { handleClose(); });
            }
        }
    }, [index, card]);

    const handleClose = () => {
        formGroup.setValues({ text: '', color: currentColor });
        onClose();
    };

    const toggleEmojiModal = () => { setEmojiModal(!emojiModal); };

    const addText = (message: string) => {
        const { text } = formGroup.values;

        formGroup.setValues({ text: text.slice(0, cursorPosition) + message + text.slice(cursorPosition) });
    };

    return (
        <Dialog
            fullWidth
            keepMounted
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Adicionar card -
                <Chip
                    label={column}
                    size="small"
                    sx={{
                        ml: 1,
                        backgroundColor: currentColor,
                        color: (theme) => theme.palette.common.white
                    }}
                />
            </DialogTitle>
            <Form formGroup={formGroup}>
                <DialogContent>
                    <EmojiDialog open={emojiModal} onClose={toggleEmojiModal} onAddEmoji={addText} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={toggleEmojiModal}>
                            <MoodIcon />
                        </IconButton>
                    </Box>
                    <Control controlName="text">
                        <TextField
                            multiline
                            fullWidth
                            rows={4}
                            variant="outlined"
                            label="Fale alguma coisa..."
                            value={formGroup.controls.text.value}
                            onChange={(e: any) => setCursorPosition(e.target['selectionStart'])}
                            onClick={(e: any) => setCursorPosition(e.target['selectionStart'])}
                        />
                    </Control>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}