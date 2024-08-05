export function capitalize(str: string) {
    if (!str) { return ''; }
    return str[0].toUpperCase() + str.slice(1);
}

export function slug(str: string) {
    return str.normalize('NFD')
        .trim().toLowerCase()
        .replace(/a-zA-Z0-9_.-+/g, '')
        .replace(/_/g, '')
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
}

export function getInitials(str: string, length = 0) {
    if (!str) { return ''; }

    const initials = str.split(' ').map(s => s[0]).join('');

    if (length) { return initials.slice(0, length); }

    return initials;
}