import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '@/services/core';

export const UserLoggedGuard = ({ children }: React.PropsWithChildren<unknown>) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.access_token) {
            navigate('/auth');
            return;
        }
    }, []);


    return children;
};
