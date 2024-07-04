import { createContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import useFilter from '@/hooks/useFilter';
import { team, user } from '@/services/core';
import type { InviteData } from '@/services/invite';
import type { TeamPopulated } from '@/services/team';

import useInvites from './TeamDetails/Invites/useInvites';

interface TeamContextConfig {
    loading: boolean;
    selectedTeam: TeamPopulated;
    myTeams: Array<TeamPopulated>;
    filter: {
        filtered: Array<TeamPopulated>;
        reset: () => void;
        do: (fn: (team: TeamPopulated) => boolean) => void;
    }
    addTeam: (team: TeamPopulated) => void;
    updateSelected: (team: TeamPopulated) => void;
    updateTeam: (team: TeamPopulated) => void;
    updateTeams: (teams: Array<TeamPopulated>) => void;
}

export const TeamContext = createContext<TeamContextConfig>({
    loading: true,
    myTeams: [],
    selectedTeam: {} as TeamPopulated,
    filter: {
        filtered: [],
        reset: () => null,
        do: () => null,
    },
    addTeam: () => null,
    updateTeam: () => null,
    updateTeams: () => null,
    updateSelected: () => undefined,
});

interface TeamProviderProps { children: React.JSX.Element; }
export default function TeamProvider({ children }: TeamProviderProps) {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [myTeams, setMyTeams] = useState<Array<TeamPopulated>>([]);
    const { filtered, filter, reset } = useFilter(myTeams);
    const [selectedTeam, setSelectedTeam] = useState<TeamPopulated>(myTeams[0]);

    const context = useMemo<TeamContextConfig>(() => ({
        reset,
        loading,
        myTeams,
        selectedTeam,
        filter: { reset, filtered, do: filter },
        addTeam: (team) => addTeam(team),
        updateTeams: (teams) => setMyTeams(teams),
        updateTeam: (team) => setMyTeams(myTeams.map(t => t.id === team.id ? team : t)),
        updateSelected: (team) => setSelectedTeam(team),
    }), [myTeams, filtered, selectedTeam, loading]);

    useEffect(() => { getTeams(); }, []);

    useEffect(() => {
        const arr = window.location.pathname.split('/');

        if (arr.length >= 3) {
            const teamId = arr[2];
            const selected = myTeams.find(t => t.id === teamId) as TeamPopulated;

            setSelectedTeam(selected);
        }
    }, [location, loading, myTeams]);

    const getTeams = () => {
        team.getUserTeamByEmail(user.current.email)
            .then(async (teams) => {
                const populatedTeam = await team.pupulateTeam(teams, user);

                setMyTeams(populatedTeam);

            })
            .finally(() => setTimeout(() => { setLoading(false); }, 500));
    };

    const addTeam = (team: TeamPopulated) => { setMyTeams([...myTeams, team]); };

    return (
        <TeamContext.Provider value={context}>
            {children}
        </TeamContext.Provider>
    );
}