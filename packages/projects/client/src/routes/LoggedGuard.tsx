import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth } from '@/services/core';

export const UserLoggedOutGuard = ({ children }: React.PropsWithChildren<unknown>) => {
    const pathRedirect = '/auth/signin';
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!auth.access_token && location.pathname !== pathRedirect) {
            navigate(pathRedirect);
            return;
        }
    }, [location]);

    return children;
};