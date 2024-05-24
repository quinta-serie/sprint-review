import C from 'js-cookie';

import { getDomain } from '@/utils/url';

import { CookieAttributes } from './interface';

export class Cookies<T extends string> {

    constructor(private domain: string = getDomain()) { }

    private save(key: T, data: any, att: CookieAttributes): void {
        C.set(key, data, att);
    }

    public remove(key: T, path = '/') {
        C.remove(key, { path, domain: this.domain });
    }

    public get<K>(key: T, decrypt = false): K {
        const data = C.get(`${key}`);
        const value = decrypt && data ? JSON.parse(window.atob(data)) : data;
        return data ? value : data;
    }

    public set(key: T, data: any, encrypt = false, expires?: number | Date, path = '/') {
        if (data) {
            const value = encrypt ? window.btoa(JSON.stringify(data)) : data;
            this.save(key, value, { domain: this.domain, path, expires: expires || 1, });
        }
    }
}