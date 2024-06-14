import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface PageProps { title?: string; children: React.ReactNode; action?: React.JSX.Element; }
export default function Page({ children, action, title }: PageProps) {
    return (
        <Container>
            <Fade in>
                <Stack spacing={2}>
                    {
                        title && <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h4" gutterBottom>{title}</Typography>
                                {action}
                            </Box>
                            <Divider />
                        </Box>
                    }
                    <Stack spacing={2}>
                        {children}
                    </Stack>
                </Stack>
            </Fade>
        </Container>
    );
}