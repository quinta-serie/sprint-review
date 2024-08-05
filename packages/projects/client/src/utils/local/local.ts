const isBrowser = () => typeof (window) !== 'undefined';

class Local<T extends string> {
    public has(key: T): boolean {
        return key in window.localStorage;
    }

    public get<K>(key: T, parse = false): K {
        const data = isBrowser() ? localStorage.getItem(key) : '';

        if (!data) { return null as K; }

        return parse ? JSON.parse(data) : data;
    }

    public set(key: T, value: string | Record<string, any>): void {
        if (isBrowser()) {
            if (typeof value === 'string') { return localStorage.setItem(key, value); }

            const data = JSON.stringify(value);
            localStorage.setItem(key, data);
        }
    }

    public remove(key: T) {
        !isBrowser() || localStorage.removeItem(key);
    }

    public clear() {
        !isBrowser() || localStorage.clear();
    }
}

export default new Local();