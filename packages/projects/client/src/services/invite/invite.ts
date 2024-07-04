import type DB from '@/services/db';
import { uuid } from '@/utils/uuid';

import type { InviteData } from './interface';

export default class Invite {
    private static PATH = 'invites';

    constructor(private db: DB) { }

    async sendInvite(data: Pick<InviteData, 'email' | 'teamId' | 'teamName'>) {
        const id = uuid();
        const status = 'sent';
        const createdAt = new Date().toISOString();

        const invite = { ...data, id, status, createdAt };

        return this.db.setItem({
            path: Invite.PATH,
            pathSegments: [id],
            data: invite,
        }).then(() => invite);
    }

    async getUserInvites(email: string) {
        return this.db.getList<InviteData>({
            path: Invite.PATH,
            pathSegments: [],
            filters: [{ field: 'email', operator: '==', value: email }],
        });
    }

    async getTeamInvites(teamId: string) {
        return this.db.getList<InviteData>({
            path: Invite.PATH,
            pathSegments: [],
            filters: [
                { field: 'teamId', operator: '==', value: teamId }
            ],
        });
    }

    async updateInviteStatus(data: InviteData) {
        return this.db.setItem({
            data,
            path: Invite.PATH,
            pathSegments: [data.id],
        });
    }

    subscription(email: string, callback: (data: InviteData) => void) {
        return this.db.subscription<InviteData>({
            path: Invite.PATH,
            pathSegments: [],
            filters: [
                { field: 'email', operator: '==', value: email },
                { field: 'status', operator: '==', value: 'sent' }
            ],
        }, callback);
    }
}