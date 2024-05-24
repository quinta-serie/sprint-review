export function getParams<T>(): T {
    return window.location.search
        .replace('?', '')
        .split('&')
        .reduce<T>((acc, value: string) => {
            const [l, v] = value.split('=') as [keyof T, any];
            acc[l] = v;
            return acc;
        }, {} as T);
}

export function getDomain() {
    const hostname = window.location.hostname;

    if (hostname === 'localhost') { return hostname; }

    return [
        '.',
        hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\-_]{3,}\.(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/)[1]
    ].join('');
}

export function getPage<T>(): T {
    return window.location.pathname.split('/').reverse()[0] as T;
}