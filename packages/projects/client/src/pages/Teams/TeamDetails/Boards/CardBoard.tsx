import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';

import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import useMenu from '@/hooks/useMenu';
import type { BoardData } from '@/services/board';

import useTeamDetails from '../useTeamDetails';

interface MenuBoardProps { board: BoardData, open: boolean; anchorEl: HTMLElement | null; handleClose: () => void; }
function MenuBoard({ board, open, anchorEl, handleClose }: MenuBoardProps) {
    const { updateBoardStatus } = useTeamDetails();

    const toogleArchive = () => {
        board.status === 'active'
            ? handleArchive()
            : handleUnarchive();
    };

    const handleArchive = () => {
        updateBoardStatus(board, 'archived')
            .finally(() => handleClose());
    };

    const handleUnarchive = () => {
        updateBoardStatus(board, 'active')
            .finally(() => handleClose());
    };

    return (
        <Menu
            open={open}
            elevation={1}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        >
            <MenuItem onClick={toogleArchive} disableRipple>
                <ArchiveIcon sx={{ mr: 1 }} />
                {board.status === 'active' ? 'Arquivar' : 'Desarquivar'}
            </MenuItem>
        </Menu>
    );
}

export function CardBoard(board: BoardData) {
    const navigate = useNavigate();
    const { anchorEl, open, handleClose, handleOpen } = useMenu();

    const goTo = () => { navigate(`/board/${board.id}`); };

    return (
        <Card
            elevation={0}
            sx={{
                border: ({ palette }) => palette.mode === 'light'
                    ? `1px solid ${palette.grey[300]}`
                    : `1px solid ${palette.grey[800]}`
            }}
        >
            <CardHeader
                action={
                    <IconButton onClick={handleOpen}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={board.name}
                subheader={
                    <Stack direction="row" spacing={1}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2" component="h6">
                            {new Date(board.createdAt).toLocaleString()}
                        </Typography>
                    </Stack>
                }
            />
            <MenuBoard
                open={open}
                board={board}
                anchorEl={anchorEl}
                handleClose={handleClose}
            />
            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={goTo}
                >
                    Ver mais
                </Button>
            </CardActions>
        </Card>
    );
}