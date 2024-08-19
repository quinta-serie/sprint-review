import { useLocation, useNavigate } from 'react-router-dom';
import { createContext, useEffect, useMemo, useState } from 'react';

import { useSnackbar } from 'notistack';

import log from '@/utils/log';
import useFilter from '@/hooks/useFilter';
import { removeDuplicate } from '@/utils/array';
import type { BoardData } from '@/services/board';
import type { TeamPopulated } from '@/services/team';
import { standardTemplate } from '@/services/template';
import { teamServices, userServices, templateServices, boardServices } from '@/services/core';

interface TeamsContextConfig {
    loading: boolean;
    selectedTeam: TeamPopulated;
    myTeams: Array<TeamPopulated>;
    filter: {
        filtered: Array<TeamPopulated>;
        reset: () => void;
        do: (fn: (team: TeamPopulated) => boolean) => void;
    }
    updateTeam: (team: TeamPopulated) => void;
    changeSelected: (team: TeamPopulated) => void;
    updateTeamStatus: (team: TeamPopulated) => void;
    updateTeams: (teams: Array<TeamPopulated>) => void;
    acceptInvite: (teamId: string) => Promise<void>;
    addTeam: (name: string, email: string) => Promise<void>;
    addTeamBoard: (teamId: string, data: Omit<BoardData, 'id' | 'createdAt' | 'status'>) => Promise<void>;
}

export const TeamsContext = createContext<TeamsContextConfig>({
    loading: true,
    myTeams: [],
    selectedTeam: {} as TeamPopulated,
    filter: { filtered: [], reset: () => null, do: () => null },
    updateTeam: () => null,
    updateTeams: () => null,
    updateTeamStatus: () => null,
    changeSelected: () => undefined,
    addTeam: () => new Promise(() => null),
    addTeamBoard: () => new Promise(() => null),
    acceptInvite: () => new Promise(() => null),
});

interface TeamsProviderProps { children: React.JSX.Element; }
export default function TeamsProvider({ children }: TeamsProviderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [myTeams, setMyTeams] = useState<Array<TeamPopulated>>([]);
    const { filtered, filter, reset } = useFilter(myTeams);
    const [selectedTeam, setSelectedTeam] = useState<TeamPopulated>(myTeams[0]);

    const { email } = userServices.current;

    const context = useMemo<TeamsContextConfig>(() => ({
        reset,
        loading,
        myTeams,
        selectedTeam,
        filter: { reset, filtered: filtered.filter(t => t.state === 'active'), do: filter },
        acceptInvite: (teamId) => acceptInvite(teamId),
        addTeam: (name, email) => addTeam(name, email),
        updateTeams: (teams) => setMyTeams(teams),
        updateTeam: (team) => setMyTeams(myTeams.map(t => t.id === team.id ? team : t)),
        updateTeamStatus: (team) => updateTeamStatus(team),
        changeSelected: (team) => setSelectedTeam(team),
        addTeamBoard: (teamId, data) => addTeamBoard(teamId, data),
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

    const addTeamBoard = async (teamId: string, data: Omit<BoardData, 'id' | 'createdAt' | 'status'>) => {
        return boardServices.createTeamBoard({ ...data, teamId })
            .then(r => {
                navigate(`board/${r.id}`);
                enqueueSnackbar('Quadro criado com sucesso!', { variant: 'success' });
            })
            .catch(() => {
                enqueueSnackbar('Oops! Tivemos um problema ao criar o quadro', { variant: 'error' });
            });
    };

    const addTeam = async (name: string, email: string) => {
        return teamServices.createTeam({ name, admin: email, members: [email] })
            .then(newTeam => {
                const { id } = newTeam;

                enqueueSnackbar('Time criado com sucesso!', { variant: 'success' });

                setMyTeams([...myTeams, {
                    id,
                    name,
                    state: 'active',
                    admin: userServices.current,
                    members: [userServices.current],
                    defaultTemplate: standardTemplate(id)
                }]);
            })
            .catch(() => {
                enqueueSnackbar('Oops! Tivemos um problema ao criar o time', { variant: 'error' });
            });
    };

    const acceptInvite = async (teamId: string) => {
        return teamServices.getTeam(teamId)
            .then(t => {
                if (!t) { throw new Error('Team not found'); }

                const mappedMembers = removeDuplicate([...t.members, email]);

                teamServices.updateTeam({ ...t, members: mappedMembers })
                    .then(async () => {
                        const populatedTeam = await teamServices.pupulateTeam([t], userServices, templateServices);

                        populatedTeam[0].members.push(userServices.current);

                        setMyTeams([...myTeams, populatedTeam[0]]);

                        enqueueSnackbar(`Você foi adicionado ao time: ${t.name}`, { variant: 'success' });
                        navigate('/teams');
                    });
            })
            .catch(e => {
                log.error(e);
                enqueueSnackbar('Time não encontrado', { variant: 'error' });
                navigate('/teams');
            });
    };

    const updateTeamStatus = (team: TeamPopulated) => {
        const newTeams = myTeams.filter(t => t.id !== team.id);

        setMyTeams([...newTeams, team]);
    };

    return (
        <TeamsContext.Provider value={context}>
            {children}
        </TeamsContext.Provider>
    );
}