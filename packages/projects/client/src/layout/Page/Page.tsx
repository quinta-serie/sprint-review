import { useEffect, useState } from 'react';

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
import InventoryIcon from '@mui/icons-material/Inventory';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { InviteData } from '@/services/invite';
import { invite, user } from '@/services/core';
import { useToInvite } from '@/pages/ToInvite';
import { removeDuplicate } from '@/utils/array';

interface MenuNotificationProps {
    open: boolean;
    invites: InviteData[];
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onDeleteInviteNotification: (id: string) => void;
}
function MenuNotification({ anchorEl, open, invites, onClose, onDeleteInviteNotification }: MenuNotificationProps) {
    const { toInvite } = useToInvite();

    const handleAccept = (data: InviteData) => {
        toInvite(data.teamId)
            .then(() => {
                invite.updateInviteStatus({ ...data, status: 'accepted' })
                    .then(() => onDeleteInviteNotification(data.id));
            });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            elevation={1}
            onClose={onClose}
            onClick={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {
                invites.length
                    ? invites.map(i =>
                        <MenuItem key={i.id} onClick={() => handleAccept(i)} >
                            <ListItemIcon>
                                <EmailIcon />
                            </ListItemIcon>
                            Convite para particiar de "{i.teamName}"
                        </MenuItem>
                    )
                    : <MenuItem
                        onClick={onClose}
                        sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 1,
                            height: 100
                        }}>
                            <InventoryIcon color="disabled" />
                            Sem notificações
                        </Box>
                    </MenuItem>
            }
        </Menu >
    );
}

interface PageProps { loading?: boolean; title?: string; children: React.ReactNode; action?: React.JSX.Element; }
export default function Page({ children, action, title, loading }: PageProps) {
    const [invites, setInvites] = useState<InviteData[]>([]);
    const { name, email, picture } = user.current;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    useEffect(() => {
        const unsubscribe = invite.subscription(email, (invite) => {
            const isSent = invite.status === 'sent';
            const isNotDuplicated = !invites.find(i => i.id === invite.id);

            if (isSent && isNotDuplicated) {
                setInvites(prev => removeDuplicate([...prev, invite]));
            }
        });

        return () => unsubscribe();
    }, [invites]);

    const handleDeleteInviteNotification = (id: string) => {
        setInvites(prev => prev.filter(i => i.id !== id));
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };

    return (
        <Container>
            <Fade in>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                        <IconButton onClick={handleClick}>
                            <Badge badgeContent={invites.length} color="info">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <MenuNotification
                            open={open}
                            invites={invites}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            onDeleteInviteNotification={handleDeleteInviteNotification}
                        />
                        <Tooltip title={name}>
                            <Avatar alt={name} src={picture} />
                        </Tooltip>
                    </Stack>
                    {
                        loading
                            ? <Skeleton variant="rounded" sx={{ height: 42, width: 250, marginTop: 0 }} />
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