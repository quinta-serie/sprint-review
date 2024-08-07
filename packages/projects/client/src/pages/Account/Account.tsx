import { useMemo } from 'react';

import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Zoom from '@mui/material/Zoom';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Page from '@/layout/Page';
import Logo from '@/components/Logo';
import { capitalize } from '@/utils/string';
import THEMES, { type Theme } from '@/theme';
import { userServices } from '@/services/core';
import Form, { FormControl, useForm, Control } from '@/components/Form';
import usePersonalTheme from '@/components/PersonalTheme/usePersonalTheme';

import cardModes, { type CardModes } from './modes';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

interface ZoneProps { title: string; subtitle?: string; children: React.JSX.Element; }
function Zone({ title, subtitle, children }: ZoneProps) {
    return (
        <Stack spacing={2}>
            <Typography variant="h5" color="text.primary">{title}</Typography>
            {
                subtitle && (
                    <Typography variant="subtitle2" color="text.primary">{subtitle}</Typography>
                )
            }
            {children}
        </Stack>
    );
}

function PersonalInformation() {
    const { enqueueSnackbar } = useSnackbar();
    const { name, picture, email } = userServices.current;

    const [formGroup] = useForm<{ name: string }>({
        form: {
            name: new FormControl({ value: name, required: true }),
        },
        handle: {
            submit: (form) => {
                const { name } = form.values;

                userServices.updateUserName(name)
                    .then(() => { enqueueSnackbar('Nome atualizado com sucesso', { variant: 'success' }); });
            }
        }
    }, []);

    return (
        <Stack spacing={3} sx={{ maxWidth: 350 }}>
            <Box>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <Avatar
                        alt={name}
                        src={picture}
                        sx={{ width: 56, height: 56 }}
                    />
                </StyledBadge>
            </Box>
            <Form formGroup={formGroup} debug>
                <Stack spacing={2}>
                    <Control controlName="name">
                        <TextField
                            fullWidth
                            label="Nome"
                            variant="outlined"
                            defaultValue={formGroup.controls.name.value}
                        />
                    </Control>

                    <TextField
                        fullWidth
                        disabled
                        label="Email"
                        variant="outlined"
                        defaultValue={email}
                    />

                    <Stack direction="row" justifyContent="flex-end">
                        <Button type="submit" variant="contained" color="secondary">
                            Alterar dados
                        </Button>
                    </Stack>
                </Stack>
            </Form>
        </Stack>
    );
}

function MiniAppACard(cardData: CardModes) {
    const { mode: chosenMode, changeMode } = usePersonalTheme();

    const cardArr = new Array(3).fill(0);
    const buttonArr = new Array(4).fill(0);

    const { title, icon, primary, background, secondary, text, mode } = cardData;

    const selected = useMemo(() => chosenMode === mode, [chosenMode]);

    const handleChangeMode = () => { changeMode(mode); };

    return (
        <Card onClick={handleChangeMode} sx={{
            color: text,
            border: selected ? `3px solid ${primary.main}` : '3px solid transparent',
            transition: 'border 0.3s',
            backgroundColor: background.paper,
        }}>
            <CardActionArea>
                <CardHeader
                    title={
                        <Stack direction="row" spacing={1}>
                            {icon}
                            <Typography>{title}</Typography>
                        </Stack>
                    }
                />
                <CardContent sx={{ pt: 0 }}>
                    <Box p={1} mb={2} position="relative">
                        <Zoom in={selected}>
                            <Box sx={{
                                top: -10,
                                right: 0,
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                position: 'absolute',
                                margin: '10px 0px 0px 0px',
                                background: ({ palette }) => palette.action.selected,
                            }}>
                                <CheckCircleIcon
                                    color="secondary"
                                    sx={{ fontSize: 30, marginLeft: '-6px', marginTop: '-4px' }}
                                />
                            </Box>
                        </Zoom>
                        <Box sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: background.default,
                        }}>
                            <Stack direction="row" spacing={1}>
                                <Stack gap={.5} sx={{
                                    width: 20,
                                    padding: .5,
                                    borderRadius: 1,
                                    backgroundColor: primary.main,
                                }}>
                                    <Logo
                                        onlyInitials
                                        color={mode === 'light' ? 'default' : 'contrast'}
                                        style={{ fontSize: 8 }}
                                    />
                                    {
                                        buttonArr.map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    background: index === 1
                                                        ? secondary.main
                                                        : primary.contrastText,
                                                    height: 5,
                                                    width: '100%',
                                                    borderRadius: 2
                                                }}
                                            />
                                        ))
                                    }
                                </Stack>
                                <Stack spacing={1} sx={{
                                    background: background.paper,
                                    height: 100,
                                    width: '100%',
                                    padding: 2,
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{
                                            background: primary.main,
                                            height: 5,
                                            width: 30,
                                            borderRadius: 2
                                        }} />
                                        <Box sx={{
                                            background: secondary.main,
                                            height: 7,
                                            width: 15,
                                            borderRadius: 2
                                        }} />
                                    </Stack>
                                    <Box>
                                        <Grid container spacing={1}>
                                            {
                                                cardArr.map((_, index) => (
                                                    <Grid key={index} item xs={4}>
                                                        <Box sx={{
                                                            height: 60,
                                                            width: '100%',
                                                            borderRadius: 2,
                                                            background: background.default,
                                                        }} />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function CardTheme({ theme }: { theme: Theme }) {
    const { mode, changeTheme, theme: currentTheme } = usePersonalTheme();

    const arr = ['primary', 'secondary'];

    const config = THEMES[theme][mode];

    const isSelect = currentTheme === theme;

    const handleChange = () => { changeTheme(theme); };

    return (
        <Card
            elevation={0}
            sx={{
                position: 'relative',
                border: ({ palette }) => isSelect
                    ? `3px solid ${palette.primary.main}`
                    : '3px solid transparent',
            }}
        >
            <CardActionArea onClick={handleChange}>
                <CardContent>
                    <Zoom in={isSelect}>
                        <Box sx={{
                            top: 0,
                            right: 8,
                            width: 15,
                            height: 15,
                            borderRadius: '50%',
                            position: 'absolute',
                            margin: '10px 0px 0px 0px',
                            background: ({ palette }) => palette.action.selected,
                        }}>
                            <CheckCircleIcon
                                color="secondary"
                                sx={{ fontSize: 25, marginLeft: '-6px', marginTop: '-4px' }}
                            />
                        </Box>
                    </Zoom>
                    <Stack direction="row" gap={1} alignItems="center">
                        {
                            arr.map((color) => (
                                <Box sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 50,
                                    background: config.palette?.[color]?.['main']
                                }} />
                            ))
                        }
                        <Typography variant="h6">{capitalize(theme)}</Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function ThemeInfo() {
    const { theme } = usePersonalTheme();

    return (
        <Stack spacing={2}>
            <Typography color="text.primary" gutterBottom>Modo de coloração</Typography>
            <Box>
                <Grid container spacing={3}>
                    {
                        cardModes(theme).map(card => (
                            <Grid key={card.title} item xs={12} sm={6} md={4}>
                                <MiniAppACard {...card} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            <Typography color="text.primary" gutterBottom>Tema</Typography>
            <Box>
                <Grid container spacing={3}>
                    {
                        Object.keys(THEMES).map(theme => (
                            <Grid key={theme} item xs={12} sm={6} md={4}>
                                <CardTheme theme={theme as Theme} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </Stack>
    );
}

export default function Account() {
    return (
        <Page>
            <Stack spacing={3}>
                <Zone title="Informações pessoais">
                    <PersonalInformation />
                </Zone>
                <Divider />
                <Zone title="Preferências">
                    <ThemeInfo />
                </Zone>
            </Stack>
        </Page>
    );
}