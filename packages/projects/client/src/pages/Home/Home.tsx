import { Children, cloneElement, forwardRef, HtmlHTMLAttributes, ReactElement, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Zoom from '@mui/material/Zoom';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import DialogTitle from '@mui/material/DialogTitle';
import CardActionArea from '@mui/material/CardActionArea';
import { TransitionProps } from '@mui/material/transitions';

import AddIcon from '@mui/icons-material/Add';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import Page from '@/layout/Page';
import useModal from '@/hooks/useModal';
import DefaultRetroImg from '@/assets/home/template_retro.png';

import HotTemplates, { type HotTamplateName } from './hot-templates';

const CustomContentCard = styled(CardContent)(({ theme }) => ({
    '&.MuiCardContent-root': {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
    },
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface TemplateConfigDialogProps { hotTemplate: HotTamplateName; open: boolean; onClose: () => void; }
function TemplateConfigDialog({ open, hotTemplate, onClose }: TemplateConfigDialogProps) {
    return (
        <Dialog
            fullWidth
            keepMounted
            open={open}
            maxWidth="sm"
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Sobre esse template</DialogTitle>
            {HotTemplates[hotTemplate]({ onClose })}
        </Dialog>
    );
}

interface TemplateCardProps extends HtmlHTMLAttributes<HTMLElement> {
    name: string;
    children: React.JSX.Element;
}
function TemplateCard({ children, name, ...props }: TemplateCardProps) {
    return (
        <Stack spacing={1} sx={{ display: 'block', height: '100%' }}>
            <Card
                elevation={0}
                sx={{
                    height: '90%',
                    transition: 'all 0.3s',
                    border: ({ palette }) => palette.mode === 'light'
                        ? `1px solid ${palette.grey[300]}`
                        : `1px solid ${palette.grey[800]}`
                }}
                {...props}
            >
                <CardActionArea sx={{ height: '100%' }}>
                    {children}
                </CardActionArea>
            </Card>
            <Typography variant="caption">{name}</Typography>
        </Stack>
    );
}

interface CreateRetroCardProps { children: React.ReactNode; }
function CreateRetroCard({ children }: CreateRetroCardProps) {
    const arrayChildren = Children.toArray(children) as ReactElement<TemplateCardProps>[];

    const renderChildren = () => {
        return arrayChildren.map((child, index) => {
            return (
                <Zoom
                    in
                    key={index}
                    style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                >
                    <Grid item xs={2}>
                        {cloneElement(child)}
                    </Grid>
                </Zoom>
            );
        });
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h5" color="text.primary">Criar retrô</Typography>
            <Card elevation={0} sx={{
                border: ({ palette }) => palette.mode === 'light'
                    ? `1px solid ${palette.grey[300]}`
                    : `1px solid ${palette.grey[800]}`
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Templates recomendados
                    </Typography>
                    <Box>
                        <Grid container spacing={2} sx={{
                            flexWrap: 'nowrap',
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            paddingBottom: 2
                        }}>
                            {renderChildren()}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Stack >
    );
}

function RecentRetros() {
    return (
        <Stack spacing={2}>
            <Typography variant="h5" color="text.primary">Retrôs recentes</Typography>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={4} lg={3}>
                        <Card
                            elevation={0}
                            sx={{
                                border: ({ palette }) => palette.mode === 'light'
                                    ? `1px solid ${palette.grey[300]}`
                                    : `1px solid ${palette.grey[800]}`
                            }}
                        >
                            <CardActionArea>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <div>
                                            <Chip
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                label="Navigation"
                                                avatar={<Avatar>N</Avatar>}
                                            />
                                        </div>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Sprint 6
                                        </Typography>
                                        <AvatarGroup max={4}>
                                            <Avatar
                                                alt="Remy Sharp"
                                                src="https://mui.com/static/images/avatar/1.jpg"
                                            />
                                            <Avatar
                                                alt="Travis Howard"
                                                src="https://mui.com/static/images/avatar/2.jpg"
                                            />
                                            <Avatar
                                                alt="Agnes Walker"
                                                src="https://mui.com/static/images/avatar/4.jpg"
                                            />
                                            <Avatar
                                                alt="Trevor Henderson"
                                                src="https://mui.com/static/images/avatar/5.jpg"
                                            />
                                            <Avatar
                                                alt="Trevor Henderson"
                                                src="https://mui.com/static/images/avatar/5.jpg"
                                            />
                                            <Avatar
                                                alt="Trevor Henderson"
                                                src="https://mui.com/static/images/avatar/5.jpg"
                                            />
                                        </AvatarGroup>
                                        <Stack direction="row" spacing={1}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <ViewAgendaIcon />
                                                <Typography variant="body1" sx={{ ml: .5 }}>
                                                    10 cards
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <FormatListBulletedIcon />
                                                <Typography variant="body1" sx={{ ml: .5 }}>
                                                    2 actions
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Stack>
    );
}

export default function Dashboard() {
    const [openBoardModal, toggleBoardModal] = useModal();
    const [chosenTemplate, setChosenTemplate] = useState<HotTamplateName>('Standard');

    const createNewRetro = () => {
        setChosenTemplate('Standard');
        toggleBoardModal();
    };
    const createDefaultRetro = () => {
        setChosenTemplate('TruthsAndLies');
        toggleBoardModal();
    };

    return (
        <Page>
            <CreateRetroCard>
                <TemplateCard name="Nova retrô" onClick={createNewRetro}>
                    <CustomContentCard>
                        <AddIcon color="inherit" sx={{ fontSize: 40 }} />
                    </CustomContentCard>
                </TemplateCard>
                <TemplateCard name="Retrô padrão" onClick={createDefaultRetro}>
                    <CardMedia
                        component="img"
                        alt="Retrô Padrão"
                        image={DefaultRetroImg}
                    />
                </TemplateCard>
            </CreateRetroCard>
            <RecentRetros />

            <TemplateConfigDialog
                open={openBoardModal}
                onClose={toggleBoardModal}
                hotTemplate={chosenTemplate}
            />
        </Page >
    );
}