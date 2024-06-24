import { useState } from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';

import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { user } from '@/services/core';

interface MenuNotificationProps { anchorEl: HTMLElement | null; open: boolean; onClose: () => void; }
function MenuNotification({ anchorEl, open, onClose }: MenuNotificationProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <EmailIcon />
                </ListItemIcon>
                Add another account
            </MenuItem>
        </Menu>
    );
}

interface PageProps { loading?: boolean; title?: string; children: React.ReactNode; action?: React.JSX.Element; }
export default function Page({ children, action, title, loading }: PageProps) {
    const { name, picture } = user.current;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };

    return (
        <Container>
            <Fade in>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                        <IconButton onClick={handleClick}>
                            <Badge badgeContent={4} color="info">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <MenuNotification
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                        />
                        <Tooltip title={name}>
                            <Avatar alt={name} src={picture} />
                        </Tooltip>
                    </Stack>
                    {
                        loading
                            ? <Skeleton variant="rounded" sx={{ height: 57, width: 250 }} />
                            : title && <Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h4">{title}</Typography>
                                    {action}
                                </Box>
                            </Box>
                    }
                    <Stack spacing={2}>
                        {children}
                    </Stack>
                </Stack>
            </Fade>
        </Container>
    );
}