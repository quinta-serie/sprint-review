import type DB from '@/services/db';
import { uuid } from '@/utils/uuid';

import type { InviteData } from './interface';

export default class Invite {
    private static PATH = 'invites';

    constructor(private db: DB) { }

    async sendInvite(data: InviteData) {
        const id = uuid();

        return this.db.setItem({
            path: Invite.PATH,
            pathSegments: [id],
            data,
        });
    }

    async getUserInvites(email: string) {
        return this.db.getList<InviteData>({
            path: Invite.PATH,
            pathSegments: [],
            filters: [{ field: 'email', operator: '==', value: email }],
        });
    }
}