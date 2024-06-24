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

import { auth, user } from '@/services/core';

export default function Signin() {
    const navigate = useNavigate();

    const redirect = () => { navigate('/home'); };

    const signinWithGoogle = () => {
        auth.login()
            .then(() => { verifyUser(redirect); });
    };

    const verifyUser = (redirect: () => void) => {
        const { email } = user.current;

        user.getUserByEmail(email)
            .then(current => {
                if (current) {
                    redirect();
                    return;
                }

                user.createUser()
                    .then(() => redirect());
            });
    };

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
                    <Box>
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
                        <Typography
                            sx={{ mt: 2, textAlign: 'center' }}
                            variant="body2"
                        >
                            Copyright © 2024, Sprint Retro
                        </Typography>
                    </Box>
                </Zoom>
            </Container>
        </ Box>
    );
}
