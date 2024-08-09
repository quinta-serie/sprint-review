
import { useMemo } from 'react';

import { useSnackbar, OptionsObject } from 'notistack';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Card from '@mui/material/Card';
import Zoom from '@mui/material/Zoom';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

import useMenu from '@/hooks/useMenu';
import useModal from '@/hooks/useModal';
import { getRandom } from '@/utils/array';
import { userServices } from '@/services/core';
import type { CardData } from '@/services/board';

import useBoard from './useBoard';
import DialogCardText from './DialogCard';

interface MenuBoardProps extends CardData { open: boolean; anchorEl: HTMLElement | null; onClose: () => void; }
function MenuOptions({ open, anchorEl, onClose, ...cardData }: MenuBoardProps) {
    const { deleteCard } = useBoard();
    const [editModalOpen, toggelEditMotal] = useModal();

    const handleOpenEditModal = () => {
        toggelEditMotal();
        onClose();
    };

    const handleDeleteCard = () => {
        deleteCard(cardData.id, cardData.column);
        onClose();
    };

    return (
        <>
            <Menu
                open={open}
                elevation={1}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem disableRipple onClick={handleOpenEditModal}>
                    <EditIcon sx={{ mr: 1 }} />
                    Editar
                </MenuItem>
                <MenuItem disableRipple onClick={handleDeleteCard}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Deletar
                </MenuItem>
            </Menu>
            <DialogCardText
                index={0}
                action="edit"
                card={cardData}
                open={editModalOpen}
                onClose={toggelEditMotal}
            />
        </>
    );
}

interface HeaderProps extends CardData { isOwner: boolean; hideCardsAutor: boolean; }
function Header({ isOwner, hideCardsAutor, ...cardData }: HeaderProps) {
    const { open, anchorEl, handleClose, handleOpen } = useMenu();

    const { owner } = cardData;

    return (
        <>
            <CardHeader
                sx={{ pb: !hideCardsAutor ? 'auto' : 0 }}
                subheader={
                    !hideCardsAutor && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar
                                alt={owner.name}
                                src={owner.name}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: 12,
                                    bgcolor: 'rgba(0,0,0,0.3)',
                                    color: ({ palette }) => palette.common.white
                                }}
                            />
                            <Typography
                                variant="body2"
                                color="white"
                            >
                                {owner.name}
                            </Typography>
                        </Stack>
                    )
                }
                action={
                    isOwner && (
                        <IconButton
                            onClick={handleOpen}
                            aria-label="settings"
                            sx={{ color: (theme) => theme.palette.common.white }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    )
                }
            />
            <MenuOptions
                {...cardData}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
            />
        </>
    );
}

type FooterProps = Pick<CardData, 'id' | 'whoLiked' | 'column'>;
function Footer({ id, whoLiked, column }: FooterProps) {
    const { board } = useBoard();
    const { enqueueSnackbar } = useSnackbar();
    const { favoriteCard, unFavoriteCard } = useBoard();
    const { maxVotesPerCard, maxVotesPerUser, } = board.template;

    const { email } = userServices.current;

    const yourTotalLikes = Object.keys(board.cards)
        .reduce((acc, column) => {
            return board.cards[column].reduce((acc, card) => {
                return acc + card.whoLiked.filter(e => e === email).length;
            }, acc);
        }, 0);

    const yourLikesInThisCard = whoLiked.filter(e => e === email).length;

    const remainingVotes = maxVotesPerUser - yourTotalLikes - 1;

    const doYouHaveTheMostVotesOnThisCard = yourLikesInThisCard >= maxVotesPerCard;
    const doYouHaveTheMaximumTotalVotes = yourTotalLikes >= maxVotesPerUser;

    const canILikeIt = !(doYouHaveTheMostVotesOnThisCard || doYouHaveTheMaximumTotalVotes);

    const handleUnfavorite = () => { unFavoriteCard({ id, column }); };

    const handleFavorite = () => {
        const optionObject = (v: OptionsObject['variant']): OptionsObject => ({
            variant: v,
            anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });

        if (!canILikeIt) {
            if (doYouHaveTheMaximumTotalVotes) {
                enqueueSnackbar('Você atingiu o limite de votos!', optionObject('warning'));
                return;
            }

            if (doYouHaveTheMostVotesOnThisCard) {
                enqueueSnackbar('Você não pode mais votar nesse card!', optionObject('warning'));
                return;
            }

            return;
        }

        const message = remainingVotes
            ? `Você tem ${remainingVotes} ${remainingVotes > 1 ? 'votos' : 'voto'}`
            : 'Você não tem mais votos';

        enqueueSnackbar(message, optionObject('default'));

        favoriteCard({ id, column });
    };

    return (
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', mr: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: .5 }}>
                {
                    new Array(yourLikesInThisCard).fill('').map((_, index) => (
                        <Zoom in
                            key={index}
                            style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                        >
                            <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.5)',
                            }} />
                        </Zoom>
                    ))
                }
                {
                    Boolean(yourLikesInThisCard) && (
                        <IconButton
                            size="small"
                            onClick={handleUnfavorite}
                            sx={{ color: (theme) => theme.palette.common.white }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )
                }
                <IconButton
                    size="small"
                    onClick={handleFavorite}
                    sx={{ color: (theme) => theme.palette.common.white }}
                >
                    <Badge
                        color="primary"
                        badgeContent={whoLiked.length}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    >
                        <ThumbUpOutlinedIcon fontSize="small" />
                    </Badge>
                </IconButton>
            </Box>
        </CardActions>
    );
}

function FakeMessage({ text }: Pick<CardData, 'text'>) {
    const widthArr = ['40%', '60%', '80%', '100%'];

    const skeletons = new Array(Math.ceil(text.length / 40)).fill('');

    const linesWidth = useMemo(() => skeletons.map(() => getRandom(widthArr)), [text]);

    return (
        <Stack spacing={1}>
            {
                skeletons.map((_, index) =>
                    <Box key={index} sx={{
                        height: 20,
                        padding: 1,
                        width: linesWidth[index],
                        background: 'rgba(255,255,255,.2)',
                        borderRadius: 1,
                    }} />
                )
            }
        </Stack>
    );
}

export default function BoadCard(data: CardData) {
    const { board } = useBoard();

    const { id, color, text, whoLiked, column } = data;

    const { hideCardsAutor, hideCardsInitially } = board.template;

    const isCardOwner = userServices.current.user_id === data.owner.id;

    const buildMessage = text.replace(/\/n/g, '\n');

    return (
        <Card sx={{ bgcolor: color, color: (theme) => theme.palette.common.white }}>
            {
                isCardOwner && (
                    <Header
                        {...data}
                        isOwner={isCardOwner}
                        hideCardsAutor={hideCardsAutor}
                    />
                )
            }
            <CardContent sx={{
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
                pt: isCardOwner || !hideCardsAutor ? 0 : 'auto',
            }}>
                {hideCardsInitially && !isCardOwner ? <FakeMessage text={text} /> : buildMessage}
            </CardContent>
            <Divider />
            <Footer id={id} column={column} whoLiked={whoLiked} />
        </Card>
    );
}