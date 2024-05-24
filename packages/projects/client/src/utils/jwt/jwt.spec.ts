import { decode } from './jwt';

interface ITokenTeste {
    exp: number;
    iat: number;
    name: string;
}

describe('JWT', () => {
    it('should convert to token into object', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODUzMDIyMDMsImlhdCI6MTY4NTIxNTgwMywibmFtZSI6Ikxlb3ppbiJ9.Ka3pD0Ra-tQ1zzIi4NRjR_fXwDQXe7NH5H7Vkv4jess';
        const decoded = decode<ITokenTeste>(token);
        expect(decoded.name).toBe('Leozin');
    });

    it('should return null when receive empty string', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9zas';
        expect(() => decode<ITokenTeste>(token)).toThrow('Invalid token');
    });
});

