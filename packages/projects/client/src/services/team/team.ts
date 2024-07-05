import DB from '@/services/db';
import { uuid } from '@/utils/uuid';

import User, { type UserData } from '../user';
import Template, { type TemplateData, defaultTemplate } from '../template';
import type { TeamData, TeamPopulated } from './interface';

export default class Team {
    private static PATH = 'teams';

    constructor(private db: DB) { }

    getTeam(teamId: string) {
        return this.db.getItem<TeamData>({
            path: Team.PATH,
            pathSegments: [],
            filters: [{ field: 'id', operator: '==', value: teamId }],
        });
    }

    getUserTeamByEmail(userEmail: string): Promise<TeamData[]> {
        return this.db.getList<TeamData>({
            path: Team.PATH,
            pathSegments: [],
            filters: [{ field: 'members', operator: 'array-contains', value: userEmail }],
        });
    }

    async createTeam(data: Omit<TeamData, 'id'>) {
        const id = uuid();

        return this.db.setItem({
            path: Team.PATH,
            pathSegments: [id],
            data: { ...data, id },
        }).then(() => ({ ...data, id }));
    }

    updateTeam(data: TeamData) {
        return this.db.setItem({
            path: Team.PATH,
            pathSegments: [data.id],
            data
        });
    }

    async pupulateTeam(teams: TeamData[], user: User, template: Template) {
        const users = await Promise.all(
            teams.map(async team => {
                return await Promise.all(team.members.map(email => {
                    return user.getUserByEmail(email);
                }));
            })
        );

        const admin = await Promise.all(teams.map(team => user.getUserByEmail(team.admin)));

        const defaultBoard = await Promise.all(teams.map(team => template.getTemplate(team.id)));

        return teams.map<TeamPopulated>((team) => ({
            ...team,
            admin: admin.find((user) => user?.email === team.admin) as UserData,
            members: team.members.map((email) => {
                return users.flat().find((user) => user?.email === email) as UserData;
            }),
            defaultTemplate:
                defaultBoard.find((template) => template?.teamId === team.id) as TemplateData
                || defaultTemplate,
        }));
    }
}