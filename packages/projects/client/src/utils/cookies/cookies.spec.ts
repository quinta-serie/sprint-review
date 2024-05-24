
import { Cookies } from './cookies';

describe('Window Cookies', () => {
    let cookies: Cookies<any>;

    beforeAll(() => {
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
        });
    });

    beforeEach(() => {
        cookies = new Cookies(process.env.DOMAIN as string);
    });

    it('should check that a cookie can be set with valid key, data, and attributes', () => {
        cookies.set('test', 'data', false, 1, '/');
        const cookie = document.cookie;

        expect(cookie).toContain('test=data');
    });

    it('should check that a cookie can be retrieved with valid key', () => {
        cookies.set('test', 'data', false, 1, '/');
        const cookie = cookies.get('test');

        expect(cookie).toBe('data');
    });

    it('should check that a cookie can be removed with valid key', () => {
        cookies.set('test', 'data', false, 1, '/');
        cookies.remove('test');

        const cookie = cookies.get('test');

        expect(cookie).toBe('');
    });


    it('should check that getting a cookie with invalid key returns undefined', () => {
        const cookie = cookies.get('invalidCookie');

        expect(cookie).toBeUndefined();
    });

    it('should check if cookie was encrypted correctly', () => {
        const data = { name: 'John', age: 30 };
        const key = 'test_key';

        cookies.set(key, data, true);

        const encryptedData = cookies.get(key);
        const expectedResult = window.btoa(JSON.stringify(data));

        expect(encryptedData).toEqual(expectedResult);
    });

    it('should check if cookie was decrypted correctly', () => {
        const data = { name: 'John', age: 30 };
        const key = 'test_key';

        cookies.set(key, data, true);

        const decryptedData = cookies.get(key, true);

        expect(decryptedData).toEqual(data);
    });
});
