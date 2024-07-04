import { useContext } from 'react';

import { InviteUserModalContext } from './InviteUserModalProvider';

export default function useInviteUserModal() {
    return useContext(InviteUserModalContext);
}