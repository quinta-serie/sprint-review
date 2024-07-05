import { createContext, useEffect, useMemo, useState } from 'react';

import { invite } from '@/services/core';
import type { InviteData } from '@/services/invite';
import usePagination, { type Pagination } from '@/hooks/usePagination';

import useTeams from '../../useTeams';

interface InvitesContextConfig {
    invites: InviteData[];
    loadingInvites: boolean;
    pagination: Pagination<InviteData>;
    getInvites: () => void;
    addInvites: (invite: InviteData[]) => void;
    excludeInvite: (invite: InviteData) => Promise<void>;
}

export const InvitesContext = createContext<InvitesContextConfig>({
    invites: [],
    loadingInvites: true,
    pagination: { paginated: [], currentPage: 1, totalPages: 10, paginate: () => null },
    addInvites: () => null,
    getInvites: () => null,
    excludeInvite: () => new Promise(() => null),
});

interface InvitesProviderProps { children: React.JSX.Element; }
export default function InvitesProvider({ children }: InvitesProviderProps) {
    const { loading, selectedTeam } = useTeams();
    const [loadingInvites, setLoadingInvites] = useState(true);
    const [invites, setInvites] = useState<InviteData[]>([]);
    const { paginate, currentPage, paginated, totalPages } = usePagination(invites, 5);

    const context = useMemo<InvitesContextConfig>(() => ({
        invites: invites.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1),
        loadingInvites,
        pagination: { paginated, currentPage, paginate, totalPages },
        getInvites: () => { getInvites(); },
        addInvites: (invites) => setInvites(prev => [...prev, ...invites]),
        excludeInvite: (invite: InviteData) => handleExclude(invite)
    }), [invites, loadingInvites, paginated]);

    useEffect(() => { getInvites(); }, [selectedTeam]);

    const getInvites = () => {
        if (loading) { return; }

        invite.getTeamInvites(selectedTeam.id)
            .then(res => setInvites(res))
            .catch(console.error)
            .finally(() => {
                setTimeout(() => { setLoadingInvites(false); }, 500);
            });
    };

    const handleExclude = async (data: InviteData) => {
        return invite.updateInviteStatus({ ...data, status: 'deleted' })
            .then(() => {
                setInvites(prev => {
                    const index = prev.findIndex(i => i.id === data.id);
                    prev[index] = { ...data, status: 'deleted' };
                    return [...prev];
                });
            })
            .catch(console.error);
    };

    return (
        <InvitesContext.Provider value={context}>
            {children}
        </InvitesContext.Provider>
    );
}