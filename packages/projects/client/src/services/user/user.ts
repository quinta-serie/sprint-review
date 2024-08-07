import local from '@/utils/local';
import type DB from '@/services/db';
import { decode } from '@/utils/jwt';
import { Cookies } from '@/utils/cookies';

import type { UserData } from './interface';

export default class User {
    private static PATH = 'users';
    private cookies = new Cookies();

    constructor(private db: DB) { }

    get currentByToken() {
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

    get current() {
        const data = local.get<UserData>('user', true);

        return {
            name: data.name,
            email: data.email,
            picture: data.picture,
            user_id: data.user_id,
        };
    }

    set current(data: UserData) { local.set('user', data); }

    getUserByEmail(email: string) {
        return this.db.getItem<UserData>({
            path: User.PATH,
            pathSegments: [],
            filters: [{ field: 'email', operator: '==', value: email }],
        });
    }

    async createUser() {
        return this.db.setItem<UserData>({
            path: User.PATH,
            data: this.currentByToken,
            pathSegments: [this.currentByToken.email],
        }).then(() => { this.current = this.currentByToken; });
    }

    async updateUserName(name: string) {
        const buildedData = { ...this.current, name };

        return this.db.setItem<UserData>({
            path: User.PATH,
            data: buildedData,
            pathSegments: [this.current.email],
        }).then(() => {
            this.current = buildedData;
        });
    }
}