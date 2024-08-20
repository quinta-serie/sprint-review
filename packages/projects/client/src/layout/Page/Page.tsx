import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export function BackLocationButton() {
    const navigate = useNavigate();

    return (
        <IconButton size="small" onClick={() => navigate('/teams')}>
            <ArrowBackIosNewIcon />
        </IconButton>
    );
}

interface PageProps {
    loading?: boolean;
    title?: string;
    children: React.ReactNode;
    action?: React.JSX.Element;
    backButton?: React.JSX.Element;
}
export default function Page({ children, action, title, loading, backButton }: PageProps) {
    return (
        <Container>
            <Fade in>
                <Stack spacing={2}>
                    {
                        loading
                            ? <Skeleton variant="rounded" sx={{ height: 42, width: 250, marginTop: 0 }} />
                            : title && (
                                <Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            {backButton}
                                            <Typography variant="h4" color="text.primary">{title}</Typography>
                                        </Box>
                                        {action}
                                    </Box>
                                </Box>
                            )
                    }
                    <Stack spacing={2}>
                        {children}
                    </Stack>
                </Stack>
            </Fade>
        </Container>
    );
}