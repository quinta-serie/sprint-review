import { Cookies } from '@/utils/cookies';

export interface AuthMethods {
    signout: () => Promise<any>;
    googleAuth: () => Promise<any>;
}

export default class Auth {
    private cookies = new Cookies();

    constructor(private methods: AuthMethods) { }

    get access_token() { return this.cookies.get('access_token'); }
    set access_token(token: string) { this.cookies.set('access_token', token); }

    public async login() {
        return this.methods.googleAuth()
            .then(r => {
                this.access_token = r.user.stsTokenManager.accessToken;
            });
    }

    public async logout() {
        return this.methods.signout()
            .then(() => { this.cookies.remove('access_token'); });
    }
}