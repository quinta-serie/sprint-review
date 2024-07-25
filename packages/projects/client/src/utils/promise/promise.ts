export function wait(callback: () => void, ms: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            callback();
            resolve();
        }, ms);
    });
}