import { forwardRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MuiDrawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTheme, styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText } from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InventoryIcon from '@mui/icons-material/Inventory';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Pix from '@/assets/pix.png';
import Logo from '@/components/Logo';
import { auth } from '@/services/core';
import { InviteData } from '@/services/invite';
import { useToInvite } from '@/pages/ToInvite';
import { removeDuplicate } from '@/utils/array';
import { inviteServices, userServices } from '@/services/core';
import useModal from '@/hooks/useModal';

import { BUTTONS } from './const';
import { IProps, IButton, IButtonDetail } from './interface';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            backgroundColor: theme.palette.primary.main,
            zIndex: 3,
            justifyContent: 'space-between',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(7),
                },
            }),
        },
    }),
);

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const WithChildren = ({ btn, goTo }: IButtonDetail) => {
    const [expanded, setExpanded] = useState(btn.open);

    return (
        <>
            <ListItem disablePadding key={btn.label}>
                <ListItemButton onClick={() => setExpanded(!expanded)}>
                    <ListItemIcon>
                        {btn.icon}
                    </ListItemIcon>
                    <ListItemText primary={btn.label} />
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
            >
                {
                    btn.children && btn.children.map(children => {
                        return (
                            <WithOutChildren
                                btn={children}
                                key={children.label}
                                disablePadding={false}
                                goTo={() => goTo(children.path, children.internal)}
                            />
                        );
                    })
                }
            </Collapse>
        </>
    );
};

const WithOutChildren = ({ btn, goTo, disablePadding = true }: IButtonDetail & { disablePadding?: boolean }) => {
    const location = useLocation();
    const { palette } = useTheme();

    const deactiveColor = palette.common.white;
    const activeColor = palette.secondary.main;
    const matchPath = location.pathname.includes(btn.path);

    return (
        <Tooltip title={btn.label} placement="right">
            <ListItem
                key={btn.label}
                disablePadding
                sx={{ color: matchPath ? activeColor : '' }}
            >
                <ListItemButton
                    onClick={() => goTo(btn.path, btn.internal)}
                    sx={{ paddingLeft: disablePadding ? 2 : 4 }}
                >
                    <ListItemIcon sx={{
                        color: matchPath ? activeColor : deactiveColor
                    }}>
                        {btn.icon}
                    </ListItemIcon>
                    <ListItemText primary={btn.label} />
                </ListItemButton>
            </ListItem>
        </Tooltip>
    );
};

interface ButtonListProps { list: Array<IButton>; onOpenDialog?: () => void; togglePixModal?: () => void; }
const ButtonList = ({ list, onOpenDialog, togglePixModal }: ButtonListProps) => {
    const navigate = useNavigate();

    const goTo = (path: string, internal: boolean) => {
        if (path === 'logout') {
            auth.logout()
                .then(() => { navigate('/auth/signin'); });
            return;
        }

        if (path === 'helps' && onOpenDialog) {
            onOpenDialog();
            return;
        }

        if (path === 'pix' && togglePixModal) {
            togglePixModal();
            return;
        }

        internal
            ? navigate(path, { replace: false })
            : window.open(path, '_blank');
    };

    return (
        <List>
            {
                list.map(btn => (
                    btn.children && btn.children.length > 0
                        ? <WithChildren btn={btn} goTo={goTo} key={btn.label} />
                        : <WithOutChildren btn={btn} goTo={goTo} key={btn.label} />
                ))
            }
        </List>
    );
};

interface PixDialogProps { open: boolean; onClose: () => void; }
function PixDialog({ onClose, open }: PixDialogProps) {
    return (
        <Dialog
            fullWidth
            keepMounted
            open={open}
            maxWidth="sm"
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Pix:</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>
                    {/* eslint-disable */}
                    Se você acha esse aplicativo útil e deseja apoiar seu desenvolvimento contínuo, considere fazer uma contribuição.
                    <br />
                    O projeto é open source e sua ajuda é fundamental para melhorar e expandir suas funcionalidades.
                    <br />
                    {/* eslint-enable */}
                </DialogContentText>
                <img src={Pix} alt="" />
            </DialogContent>
        </Dialog>
    );
}

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
            .then(() => inviteServices.updateInviteStatus({ ...data, status: 'accepted' }))
            .then(() => onDeleteInviteNotification(data.id));
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
                        sx={{
                            border: ({ palette }) => palette.mode === 'light'
                                ? `1px solid ${palette.grey[300]}`
                                : `1px solid ${palette.grey[800]}`
                        }}
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

export default function Default({ children }: IProps) {
    const navigate = useNavigate();
    const [openPixModal, togglePixModal] = useModal();
    const [invites, setInvites] = useState<InviteData[]>([]);
    const { name, email, picture } = userServices.current;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    useEffect(() => {
        const unsubscribe = inviteServices.subscription(email, (invite) => {
            const isSent = invite.status === 'sent';
            const isNotDuplicated = !invites.find(i => i.id === invite.id);

            if (isSent && isNotDuplicated) {
                setInvites(prev => removeDuplicate([...prev, invite]));
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteInviteNotification = (id: string) => { setInvites(prev => prev.filter(i => i.id !== id)); };

    const handleClose = () => { setAnchorEl(null); };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };

    const goToProfile = () => { navigate('/my-account'); };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent" open={false}>
                <nav aria-label="main navigation options">
                    <Box sx={{ mt: 4, mb: 4 }}>
                        <Logo
                            tag="h2"
                            color="contrast"
                            onlyInitials
                            style={{ textAlign: 'center' }}
                        />
                    </Box>
                    <ButtonList list={BUTTONS.main} />
                </nav>
                <nav aria-label="secondary navigation options">
                    <ButtonList list={BUTTONS.ref} togglePixModal={togglePixModal} />
                    <Divider />
                    <ButtonList list={BUTTONS.end} />
                </nav>
            </Drawer>
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    backgroundColor: 'background.default'
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{ mt: 4, mb: 4 }}
                >
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mb: 4 }}>
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
                        <Tooltip title={name} onClick={goToProfile}>
                            <Avatar alt={name} src={picture} sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                    </Stack>
                    {children}
                </Container>
            </Box>
            <PixDialog open={openPixModal} onClose={togglePixModal} />
        </Box>
    );
}
