import { createContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import useFilter from '@/hooks/useFilter';
import { team, user } from '@/services/core';
import type { TeamPopulated } from '@/services/team';

interface TeamContextConfig {
    loading: boolean;
    selectedTeam: TeamPopulated;
    myTeams: Array<TeamPopulated>;
    updateSelected: (team: TeamPopulated) => void;
    filter: {
        filtered: Array<TeamPopulated>;
        reset: () => void;
        do: (fn: (team: TeamPopulated) => boolean) => void;
    }
    addTeam: (team: TeamPopulated) => void;
    updateTeams: (team: Array<TeamPopulated>) => void;
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
    updateSelected: () => undefined,
    addTeam: () => null,
    updateTeams: () => null,
});

interface TeamProviderProps { children: React.JSX.Element; }
export default function TeamProvider({ children }: TeamProviderProps) {
    const location = useLocation();
    const [myTeams, setMyTeams] = useState<Array<TeamPopulated>>([]);
    const { filtered, filter, reset } = useFilter(myTeams);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState<TeamPopulated>(myTeams[0]);

    const context = useMemo<TeamContextConfig>(() => ({
        reset,
        loading,
        myTeams,
        selectedTeam,
        filter: { reset, filtered, do: filter },
        addTeam: (team) => addTeam(team),
        updateTeams: (teams) => setMyTeams(teams),
        updateSelected: (team) => setSelectedTeam(team),
    }), [myTeams, filtered, selectedTeam, loading]);

    useEffect(() => { getTeams(); }, []);

    useEffect(() => {
        const arr = window.location.pathname.split('/');

        if (arr.length >= 3) { setSelectedTeam(myTeams.find(t => t.id === arr[2]) as TeamPopulated); }
    }, [location]);

    const getTeams = () => {
        team.getUserTeamByEmail(user.current.email)
            .then(async (teams) => {
                const populatedTeam = await team.pupulateTeam(teams, user);

                setMyTeams(populatedTeam);

                setTimeout(() => { setLoading(false); }, 500);
            });
    };

    const addTeam = (team: TeamPopulated) => { setMyTeams([...myTeams, team]); };

    return (
        <TeamContext.Provider value={context}>
            {children}
        </TeamContext.Provider>
    );
}