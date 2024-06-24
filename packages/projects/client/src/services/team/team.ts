import DB from '@/services/db';
import { uuid } from '@/utils/uuid';

import User, { type UserData } from '../user';
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

    updateMemberToTeam(data: TeamData) {
        return this.db.setItem({
            path: Team.PATH,
            pathSegments: [data.id],
            data: {
                ...data,
                members: data.members,
            }
        });
    }

    async pupulateTeam(teams: TeamData[], user: User) {
        const users = await Promise.all(
            teams.map(async team => {
                return await Promise.all(team.members.map(email => {
                    return user.getUserByEmail(email);
                }));
            })
        );

        const admin = await Promise.all(teams.map(team => user.getUserByEmail(team.admin)));

        return teams.map<TeamPopulated>((team) => ({
            ...team,
            admin: admin.find((user) => user?.email === team.admin) as UserData,
            members: team.members.map((email) => {
                return users.flat().find((user) => user?.email === email) as UserData;
            }),
        }));
    }
}