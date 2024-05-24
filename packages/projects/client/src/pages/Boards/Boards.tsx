import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { auth } from '@/services/core';

export default function Boards() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout()
            .then(() => { navigate('/signin') });
    };

    return (
        <Box>
            <p>meus boards</p>

            <Button onClick={handleLogout}>Loggout</Button>
        </Box>
    );
}