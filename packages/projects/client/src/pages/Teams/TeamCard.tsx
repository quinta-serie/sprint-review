import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import CardActionArea from '@mui/material/CardActionArea';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import type { TeamPopulated } from '@/services/team';

export default function TeamCard({ admin, members, name, id }: TeamPopulated) {
    const navigate = useNavigate();

    const goToDetails = () => navigate(`/teams/${id}/boards`);

    return (
        <Card
            elevation={0}
            sx={{
                border: ({ palette }) => palette.mode === 'light'
                    ? `1px solid ${palette.grey[300]}`
                    : `1px solid ${palette.grey[800]}`
            }}
        >
            <CardActionArea onClick={goToDetails}>
                <CardHeader title={name} />
                <CardContent>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <AvatarGroup max={4}>
                                {
                                    members.map(({ picture, name, user_id }) =>
                                        <Avatar key={user_id} alt={name} src={picture} />
                                    )
                                }
                            </AvatarGroup>
                        </Box>
                        <Tooltip title="Owner">
                            <Stack direction="row" spacing={1}>
                                <AdminPanelSettingsIcon />
                                <Typography variant="body1" >
                                    {admin.name}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}