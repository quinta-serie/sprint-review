import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Zoom from '@mui/material/Zoom';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import CardActionArea from '@mui/material/CardActionArea';

import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import Page from '@/layout/Page';

import hotTemplates, { type HotTemplates, State } from './hot-templates';

const CustomContentCard = styled(CardContent)(({ theme }) => ({
    '&.MuiCardContent-root': {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.secondary.main,
    },
}));

function TemplateCards(template: HotTemplates<State>) {
    return (
        <Stack spacing={1} sx={{ display: 'block', height: '100%' }}>
            <Card
                elevation={0}
                sx={{
                    height: '90%',
                    transition: 'all 0.3s',
                    border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                }}
            >
                <CardActionArea sx={{ height: '100%' }}>
                    {
                        template.state === 'new'
                            ? <CustomContentCard>
                                {template.icon}
                            </CustomContentCard>
                            : <CardContent>
                                <CardMedia
                                    component="img"
                                    image={template.img}
                                    alt={template.name}
                                />
                            </CardContent>
                    }
                </CardActionArea>
            </Card>
            <Typography variant="caption">
                {template.name}
            </Typography>
        </Stack>
    );
}

function CreateRetroCard() {
    return (
        <Stack spacing={2}>
            <Typography variant="h5">
                Criar retrô
            </Typography>
            <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Templates recomendados
                    </Typography>
                    <Box>
                        <Grid container spacing={2}>
                            {
                                hotTemplates.map((ht, index) => (
                                    <Zoom
                                        in
                                        key={ht.name}
                                        style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                                    >
                                        <Grid key={ht.name} item xs={6} md={4} lg={3}>
                                            <TemplateCards {...ht} />
                                        </Grid>
                                    </Zoom>
                                ))
                            }
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
}

function RecentRetros() {
    return (
        <Stack spacing={2}>
            <Typography variant="h5">
                Retrôs recentes
            </Typography>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={4} lg={3}>
                        <Card
                            elevation={0}
                            sx={{
                                border: (theme) => `1px solid ${theme.palette.grey[300]}`,
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
                                        <AvatarGroup max={4} >
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
    return (
        <Page>
            <CreateRetroCard />
            <RecentRetros />
        </Page>
    );
}