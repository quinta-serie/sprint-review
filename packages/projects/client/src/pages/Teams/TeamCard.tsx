import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import CardActionArea from '@mui/material/CardActionArea';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import type { TeamPopulated } from '@/services/team';

interface TeamCardProps extends TeamPopulated { onAddMember: (team: TeamPopulated) => void; }
export default function TeamCard({ onAddMember, admin, members, name, id }: TeamCardProps) {
    const navigate = useNavigate();

    const goToDetails = () => navigate(`/teams/${id}/boards`);

    const handleAddMember = () => { onAddMember({ admin, members, name, id }); };

    return (
        <Card
            elevation={0}
            sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}
        >
            <CardHeader
                title={name}
                action={
                    <IconButton onClick={handleAddMember}>
                        <PersonAddIcon />
                    </IconButton>
                }
            />
            <CardActionArea onClick={goToDetails}>
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