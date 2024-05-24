import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserLoggedGuard = ({ children }: React.PropsWithChildren<unknown>) => {
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: add logic to check if user is logged in
        const isLoggedOut = true;

        if (isLoggedOut) {
            navigate('/auth');
            return;
        }

    }, []);


    return children;
};
