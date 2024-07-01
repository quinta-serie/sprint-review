export type Country = 'br';

export function sanitize(value: string) {
    const regex = /[\WA-Z]/g;
    return value.replace(regex, '');
}

/**
 * Formatter Cel with DDD.
 * @param {string} value - cel Ex: 00000000000
 * @return {string} Ex: (00) 00000-0000
*/
export function maskPhone(value: string | undefined): string {
    if (!value) { return ''; }

    return value.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2')
        .substring(0, 15);
}

/**
 * Formatter CPF.
 * @param {string} value - cpf Ex: 00000000000
 * @return {string} Ex: 000.000.000-00
*/
export function maskCpf(value: string | undefined): string {
    if (!value) { return ''; }

    return value.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .substring(0, 14);
}

export function maskcurrency(value = 0, country: Country = 'br'): string {
    const MAP = {
        br: { locale: 'pt-BR', currency: 'BRL', },
    };
    const mapped = MAP[country];

    return new Intl
        .NumberFormat(mapped.locale, { style: 'currency', currency: mapped.currency, maximumSignificantDigits: 7 })
        .format(value)
        .replace(/\s/, ' ');
}
