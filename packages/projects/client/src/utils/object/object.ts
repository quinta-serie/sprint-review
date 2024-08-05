export function deepCopy<T extends Array<any> | Record<string, any>>(obj: T) {
    const copy = Object.assign({}, obj) as T;

    for (const key in copy) {
        copy[key as any] = typeof obj[key] === 'object' ? deepCopy(obj[key as any]) : obj[key];
    }

    if (Array.isArray(obj)) {
        copy.length = obj.length;
        return Array.from(copy as any) as T;
    }

    return copy as T;
}