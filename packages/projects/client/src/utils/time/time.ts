
export function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
}

export function addSeconds(date: Date, seconds: number) {
    return new Date(date.getTime() + seconds * 1000);
}

export function removeMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() - minutes * 60000);
}