import { useContext } from 'react';

import { InvitesContext } from './InvitesProvider';

export default function useInvites() {
    return useContext(InvitesContext);
}