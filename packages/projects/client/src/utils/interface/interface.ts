export type ArrayOrObject<T> = T extends Array<infer U> ? U : T;

export type MaxDepth = 5;

export type Path<T, P extends string = '', D extends unknown[] = []> = D['length'] extends MaxDepth
    ? ''
    : T extends object
    ? {
        [K in keyof T]: K extends string
        ? `${P}${P extends '' ? '' : '.'}${K}` | Path<T[K], `${P}${P extends '' ? '' : '.'}${K}`, [...D, unknown]>
        : never;
    }[keyof T]
    : '';

export type PathValue<T, P extends string> =
    P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
    : P extends keyof T
    ? T[P]
    : never;
