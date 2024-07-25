import type DB from '@/services/db';
import { decode } from '@/utils/jwt';
import { Cookies } from '@/utils/cookies';

import type { UserData } from './interface';

export default class User {
    private static PATH = 'users';
    private cookies = new Cookies();

    constructor(private db: DB) { }

    get current() {
        // TODO: temporary solution
        try {
            const data = decode<UserData>(this.cookies.get('access_token'));

            return {
                name: data.name,
                email: data.email,
                picture: data.picture,
                user_id: data.user_id,
            };
        } catch (error) {
            window.location.href = '/auth';
            return { name: '', email: '', picture: '', user_id: '' };
        }
    }

    getUserByEmail(email: string) {
        return this.db.getItem<UserData>({
            path: User.PATH,
            pathSegments: [],
            filters: [{ field: 'email', operator: '==', value: email }],
        });
    }

    createUser() {
        return this.db.setItem<UserData>({
            path: User.PATH,
            data: this.current,
            pathSegments: [this.current.email],
        });
    }
}