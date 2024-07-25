import { createContext, useMemo, useState } from 'react';

import { useSnackbar } from 'notistack';

import { wait } from '@/utils/promise';
import type { UserData } from '@/services/user';
import type { BoardData } from '@/services/board';
import type { InviteData } from '@/services/invite';
import type { TeamData, TeamPopulated } from '@/services/team';
import { defaultTemplate, TemplateWithEditableData, type TemplateData } from '@/services/template';
import { userServices, teamServices, boardServices, inviteServices, templateServices } from '@/services/core';

type Loading = { details: boolean; boards: boolean; invites: boolean; templates: boolean; };

interface TeamDetailsContextConfig {
    team: TeamPopulated;
    loading: Loading;
    boards: BoardData[];
    invites: InviteData[];
    templates: TemplateData[];

    getTeamBoards: () => void;
    getTeamInvites: () => void;
    getTeamTemplates: () => void;
    getTeamDetails: (teamId: string) => void;

    addInvites: (invite: InviteData[]) => void;

    updateTeamName: (name: string) => Promise<void>;
    updateTeamTemplate: (data: TemplateData) => Promise<void>;
    updateBoardStatus: (data: BoardData, status: BoardData['status']) => Promise<void>;

    createTeamTemplate: (data: TemplateWithEditableData) => Promise<void>
    createTeamBoard: (data: Omit<BoardData, 'id' | 'createdAt' | 'status'>) => Promise<void>;

    deleteMember: (memberId: string) => Promise<void>;
    deleteInvite: (data: InviteData) => Promise<void>;
}

const defaultUser: UserData = { email: '', user_id: '', name: '', picture: '' };
const defaultTeam: TeamPopulated = {
    id: '',
    name: '',
    members: [],
    admin: defaultUser,
    defaultTemplate: defaultTemplate('')
};

export const TeamDetailsContext = createContext<TeamDetailsContextConfig>({
    team: {} as TeamPopulated,
    boards: [],
    invites: [],
    templates: [],
    loading: { details: true, boards: true, invites: true, templates: true },

    getTeamBoards: () => null,
    getTeamDetails: () => null,
    getTeamInvites: () => null,
    getTeamTemplates: () => null,

    addInvites: () => null,

    updateTeamName: () => new Promise(() => null),
    updateBoardStatus: () => new Promise(() => null),
    updateTeamTemplate: () => new Promise(() => null),

    createTeamBoard: () => new Promise(() => null),
    createTeamTemplate: () => new Promise(() => null),

    deleteMember: () => new Promise(() => null),
    deleteInvite: () => new Promise(() => null),
});

interface TeamDetailsProviderProps { children: React.JSX.Element; }
export default function TeamDetailsProvider({ children }: TeamDetailsProviderProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [team, setTeam] = useState<TeamPopulated>(defaultTeam);
    const [boards, setBoards] = useState<BoardData[]>([]);
    const [invites, setInvites] = useState<InviteData[]>([]);
    const [templates, setTemplates] = useState<TemplateData[]>([]);
    const [loading, setLoading] = useState<Loading>({ details: true, boards: true, invites: true, templates: true });

    const context = useMemo<TeamDetailsContextConfig>(() => ({
        team,
        boards,
        loading,
        templates,
        invites: invites.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1),

        getTeamBoards: () => getTeamBoards(),
        getTeamInvites: () => getTeamInvites(),
        getTeamTemplates: () => getTeamTemplates(),
        getTeamDetails: (id) => getTeamDetails(id),

        addInvites: (invites) => setInvites(prev => [...prev, ...invites]),

        updateTeamName: (name) => updateTeamName(name),
        updateTeamTemplate: (data) => updateTeamTemplate(data),
        updateBoardStatus: (data, status) => updateBoardStatus(data, status),

        createTeamBoard: (data) => createTeamBoard(data),
        createTeamTemplate: (data) => createTeamTemplate(data),

        deleteInvite: (data) => deleteInvite(data),
        deleteMember: (memberId) => deleteMember(memberId),
    }), [team, loading, boards, invites, templates]);

    const getTeamDetails = async (teamId: string) => {
        teamServices.getTeam(teamId)
            .then((t) => teamServices.pupulateTeam([t] as TeamData[], userServices, templateServices))
            .then((t) => { setTeam(t[0]); })
            .then(() => wait(() => setLoading(prev => ({ ...prev, details: false })), 500));
    };

    const getTeamBoards = async () => {
        boardServices.getTeamBoards(team?.id as string)
            .then((res) => setBoards(res))
            .then(() => wait(() => setLoading(prev => ({ ...prev, boards: false })), 500));
    };

    const getTeamInvites = () => {
        inviteServices.getTeamInvites(team.id)
            .then(res => { setInvites(res); })
            .catch(console.error)
            .then(() => wait(() => setLoading(prev => ({ ...prev, invites: false })), 500));
    };

    const getTeamTemplates = () => {
        templateServices.getTeamTemplates(team.id)
            .then(res => { setTemplates(res); })
            .catch(console.error)
            .then(() => wait(() => setLoading(prev => ({ ...prev, templates: false })), 500));
    };

    const updateTeamName = async (name: string) => {
        return teamServices.updateTeam({
            ...team,
            name,
            admin: team.admin.email,
            defaultTemplate: team.defaultTemplate.id,
            members: team.members.map(m => m.email),
        }).then(() => {
            setTeam(prev => ({ ...prev, name } as TeamPopulated));
            enqueueSnackbar('Nome do time atualizado!', { variant: 'success' });
        });
    };

    const updateTeamTemplate = async (data: TemplateData) => {
        return templateServices.updateTemplate(data)
            .then(() => {
                setTeam(prev => ({ ...prev, defaultTemplate: data }));
                enqueueSnackbar('Template editado com sucesso!', { variant: 'success' });
            });
    };

    const updateBoardStatus = async (data: BoardData, status: BoardData['status']) => {
        const buildData = { ...data, status };

        return boardServices.updateBoard(buildData)
            .then(() => {
                setBoards(prev => {
                    const filtered = prev.filter(b => b.id !== data.id);
                    return [...filtered, buildData];
                });
                enqueueSnackbar('Status do board atualizado!', { variant: 'success' });
            });
    };

    const createTeamTemplate = async (data: TemplateWithEditableData) => {
        return templateServices.createTemplate(data)
            .then((data) => {
                setTemplates(prev => [...prev, data]);
                setTeam(prev => ({ ...prev, defaultTemplate: data }));
                enqueueSnackbar('Template criado com sucesso!', { variant: 'success' });
            });
    };

    const createTeamBoard = async (data: Omit<BoardData, 'id' | 'createdAt' | 'status'>) => {
        return boardServices.createTeamBoard(data)
            .then((data) => {
                setBoards(prev => [...prev, data]);
                enqueueSnackbar('Board criado com sucesso!', { variant: 'success' });
            });
    };

    const deleteMember = async (email: string) => {
        return teamServices.updateTeam({
            ...team,
            admin: team.admin.email,
            defaultTemplate: team.defaultTemplate.id,
            members: team.members
                .filter(m => m.email !== email)
                .map(m => m.email),
        }).then(() => setTeam(prev => ({
            ...prev,
            members: prev.members.filter(m => m.email !== email)
        })));
    };

    const deleteInvite = async (data: InviteData) => {
        return inviteServices.updateInviteStatus({ ...data, status: 'deleted' })
            .then(() => {
                setInvites(prev => {
                    const index = prev.findIndex(i => i.id === data.id);
                    prev[index] = { ...data, status: 'deleted' };
                    return [...prev];
                });
            });
    };

    return (
        <TeamDetailsContext.Provider value={context}>
            {children}
        </TeamDetailsContext.Provider>
    );

}