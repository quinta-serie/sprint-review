import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Zoom from '@mui/material/Zoom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import GoogleIcon from '@mui/icons-material/Google';

import { auth } from '@/services/core';

export default function Signin() {
    const navigate = useNavigate();

    const signinWithGoogle = () => {
        auth.login()
            .then(() => { navigate('/boards') });
    }

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: (theme) => theme.palette.grey[300]
        }}>
            <Container sx={{ width: 500 }}>
                <Zoom in>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Signin
                                    </Typography>
                                    <Typography gutterBottom variant="body2" component="p">
                                        Use your account google to signin
                                    </Typography>
                                </Box>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    startIcon={<GoogleIcon />}
                                    onClick={signinWithGoogle}
                                >
                                    Sign in with google
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Zoom>
            </Container>
        </ Box>
    );
}