import { capitalize, slug } from './string';

describe('capitalize function', () => {

    it('should check that a single word is capitalized', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should check that multiple words are capitalized', () => {
        expect(capitalize('hello world')).toBe('Hello world');
    });

    it('should check that an empty string returns an empty string', () => {
        expect(capitalize('')).toBe('');
    });

    it('should check that a string containing non-ASCII characters is capitalized', () => {
        expect(capitalize('éxample')).toBe('Éxample');
    });

});

describe('slug function', () => {
    it('should check if returns correctly for input with no special characters', () => {
        expect(slug('hello world')).toBe('hello-world');
    });

    it('should check if returns correctly for input with special characters', () => {
        expect(slug('Hello, World!')).toBe('hello-world');
    });

    it('should check if returns correctly for input with uppercase characters', () => {
        expect(slug('Hello World')).toBe('hello-world');
    });

    it('should check if returns correctly for input with trailing spaces', () => {
        expect(slug('  hello world  ')).toBe('hello-world');
    });

    it('should check if returns an empty string for input with only special characters', () => {
        expect(slug('!@#$%^&*()_+')).toBe('');
    });

    it('should check if returns an empty string for input with only spaces', () => {
        expect(slug('    ')).toBe('');
    });
});
