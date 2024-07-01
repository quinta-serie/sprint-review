import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth } from '@/services/core';

export const UserLoggedOutGuard = ({ children }: React.PropsWithChildren<unknown>) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!auth.access_token) {
            navigate('/auth');
            return;
        }
    }, [location]);

    return children;
};

export const UserLoggedGuard = ({ children }: React.PropsWithChildren<unknown>) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (auth.access_token) {
            navigate('/home');
            return;
        }
    }, [location]);

    return children;
};
