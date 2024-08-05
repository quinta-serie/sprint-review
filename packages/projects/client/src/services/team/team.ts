import DB from '@/services/db';
import { uuid } from '@/utils/uuid';

import User, { type UserData } from '../user';
import Template, { type TemplateData } from '../template';
import type { TeamData, TeamPopulated } from './interface';

export default class Team {
    private static PATH = 'teams';

    constructor(private db: DB) { }

    getTeam(teamId: string) {
        return this.db.getItem<TeamData>({
            path: Team.PATH,
            pathSegments: [],
            filters: [
                { field: 'id', operator: '==', value: teamId },
                { field: 'state', operator: '==', value: 'active' }
            ],
        });
    }

    getUserTeamByEmail(userEmail: string): Promise<TeamData[]> {
        return this.db.getList<TeamData>({
            path: Team.PATH,
            pathSegments: [],
            filters: [
                { field: 'members', operator: 'array-contains', value: userEmail },
                { field: 'state', operator: '==', value: 'active' }
            ],
        });
    }

    async createTeam(data: Omit<TeamData, 'id' | 'state'>) {
        const id = uuid();

        return this.db.setItem<TeamData>({
            path: Team.PATH,
            pathSegments: [id],
            data: { ...data, id, state: 'active' },
        }).then(() => ({ ...data, id }));
    }

    updateTeam(data: TeamData) {
        return this.db.setItem({
            path: Team.PATH,
            pathSegments: [data.id],
            data
        });
    }

    async pupulateTeam(teams: TeamData[], user: User, template: Template): Promise<TeamPopulated[]> {
        return Promise.all(
            teams.map(async team => {
                const members = await Promise.all(team.members.map(email => {
                    return user.getUserByEmail(email);
                })) as UserData[];

                const admin = await user.getUserByEmail(team.admin) as UserData;

                const defaultTemplate = await template.getTeamDefaultTemplate(team.id) as TemplateData;

                return { ...team, members, admin, defaultTemplate };
            })
        );
    }
}