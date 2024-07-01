import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MuiDrawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useTheme, styled } from '@mui/material/styles';

import LinkIcon from '@mui/icons-material/Link';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

import Logo from '@/components/Logo';
import { auth } from '@/services/core';

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
    const activeColor = palette.secondary.light;
    const matchPath = location.pathname.includes(btn.path);

    return (
        <Tooltip title={btn.label} placement="right">
            <ListItem
                key={btn.label}
                disablePadding
                sx={{ color: matchPath ? activeColor : deactiveColor }}
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

const ButtonList = ({ list, onOpenDialog }: { list: Array<IButton>; onOpenDialog?: () => void; }) => {
    const navigate = useNavigate();

    const goTo = (path: string, internal: boolean) => {
        if (path === 'logout') {
            auth.logout()
                .then(() => { navigate('/signin'); });
            return;
        }

        if (path === 'helps' && onOpenDialog) {
            onOpenDialog();
            return;
        }

        internal
            ? navigate(path, { replace: false })
            : window.location.href = path;
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
        </List >
    );
};

export interface QuestionDialogProps { open: boolean; onClose: () => void; }
function QuestionDialog({ open, onClose }: QuestionDialogProps) {
    const handleClose = () => { onClose(); };
    const handleListItemClick = (value: string) => { console.log('value', value); };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Tutoriais</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem disableGutters>
                    <ListItemButton onClick={() => handleListItemClick('how_to_create_workflow')}>
                        <ListItemAvatar>
                            <Avatar>
                                <LinkIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Como criar uma automação?" />
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton onClick={() => handleListItemClick('how_to_create_workflow')}>
                        <ListItemAvatar>
                            <Avatar>
                                <LinkIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Onde posso ver minhas automações?" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default function Default({ children }: IProps) {
    const [open, setOpen] = useState(false);

    const toggleDialogQuestion = () => { setOpen(!open); };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent" open={false}>
                <nav aria-label="main navigation options">
                    <Box sx={{ mt: 4, mb: 4 }}>
                        <Logo
                            tag="h2"
                            color="contrast"
                            style={{ textAlign: 'center' }}
                        />
                    </Box>
                    <ButtonList list={BUTTONS.main} />
                    <Divider />
                    <ButtonList list={BUTTONS.support} onOpenDialog={toggleDialogQuestion} />
                </nav>
                <nav aria-label="secondary navigation options">
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
                    sx={{
                        mt: 4,
                        mb: 4,
                    }}
                >
                    {children}
                </Container>
            </Box>
            <QuestionDialog open={open} onClose={toggleDialogQuestion} />
        </Box>
    );
}
