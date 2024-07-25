import { useLocation } from 'react-router-dom';
import { createContext, useEffect, useMemo, useState } from 'react';

import useFilter from '@/hooks/useFilter';
import type { TeamPopulated } from '@/services/team';
import { teamServices, userServices, templateServices } from '@/services/core';

interface TeamsContextConfig {
    loading: boolean;
    selectedTeam: TeamPopulated;
    myTeams: Array<TeamPopulated>;
    filter: {
        filtered: Array<TeamPopulated>;
        reset: () => void;
        do: (fn: (team: TeamPopulated) => boolean) => void;
    }
    addTeam: (team: TeamPopulated) => void;
    changeSelected: (team: TeamPopulated) => void;
    updateTeam: (team: TeamPopulated) => void;
    updateTeams: (teams: Array<TeamPopulated>) => void;
}

export const TeamsContext = createContext<TeamsContextConfig>({
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
    changeSelected: () => undefined,
});

interface TeamsProviderProps { children: React.JSX.Element; }
export default function TeamsProvider({ children }: TeamsProviderProps) {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [myTeams, setMyTeams] = useState<Array<TeamPopulated>>([]);
    const { filtered, filter, reset } = useFilter(myTeams);
    const [selectedTeam, setSelectedTeam] = useState<TeamPopulated>(myTeams[0]);

    const context = useMemo<TeamsContextConfig>(() => ({
        reset,
        loading,
        myTeams,
        selectedTeam,
        filter: { reset, filtered, do: filter },
        addTeam: (team) => addTeam(team),
        updateTeams: (teams) => setMyTeams(teams),
        updateTeam: (team) => setMyTeams(myTeams.map(t => t.id === team.id ? team : t)),
        changeSelected: (team) => setSelectedTeam(team),
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
        teamServices.getUserTeamByEmail(userServices.current.email)
            .then((teams) => teamServices.pupulateTeam(teams, userServices, templateServices))
            .then((teams) => setMyTeams(teams))
            .finally(() => setTimeout(() => { setLoading(false); }, 500));
    };

    const addTeam = (team: TeamPopulated) => { setMyTeams([...myTeams, team]); };

    return (
        <TeamsContext.Provider value={context}>
            {children}
        </TeamsContext.Provider>
    );
}