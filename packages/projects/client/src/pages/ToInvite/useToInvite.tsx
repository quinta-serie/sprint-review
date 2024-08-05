import { useState } from 'react';

import useTeams from '@/pages/Teams/useTeams';

export default function useToInvite() {
    const { acceptInvite } = useTeams();
    const [loading, setLoading] = useState(true);

    const toInvite = async (teamId: string) => {
        setLoading(true);

        return acceptInvite(teamId)
            .finally(() => setTimeout(() => { setLoading(false); }, 500));
    };

    return { loading, toInvite };
}