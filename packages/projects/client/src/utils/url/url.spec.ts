import { getDomain, getParams } from './url';

describe('url', () => {
    describe('getDomain', () => {
        it('should return "localhost" when the hostname is "localhost"', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { hostname: 'localhost' },
                writable: true,
            });

            // Act
            const result = getDomain();

            // Assert
            expect(result).toEqual('localhost');
        });

        it('should return the domain name when the hostname is a valid domain', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { hostname: 'www.example.com' },
                writable: true,
            });

            // Act
            const result = getDomain();

            // Assert
            expect(result).toEqual('.example.com');
        });

        it('should return the domain name when the hostname is a valid subdomain', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { hostname: 'subdomain.example.com' },
                writable: true,
            });

            // Act
            const result = getDomain();

            // Assert
            expect(result).toEqual('.example.com');
        });

        it('should throw an error when the hostname is not a valid domain or subdomain', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { hostname: 'invalid' },
                writable: true,
            });

            // Act & Assert
            expect(() => getDomain()).toThrowError();
        });
    });

    describe('getParams', () => {
        it('should return an empty object when there are no query parameters', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { search: '' },
                writable: true,
            });

            // Act
            const result = getParams();

            // Assert
            expect(result).toEqual({});
        });

        it('should return an object with the query parameters', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { search: '?foo=bar&baz=qux' },
                writable: true,
            });

            // Act
            const result = getParams();

            // Assert
            expect(result).toEqual({ foo: 'bar', baz: 'qux' });
        });

        it('should return an object with the query parameters of any type', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { search: '?foo=1&bar=true&baz=qux' },
                writable: true,
            });

            // Act
            const result = getParams();

            // Assert
            expect(result).toEqual({ foo: '1', bar: 'true', baz: 'qux' });
        });

        it('should return an object with the query parameters of any type and length', () => {
            // Arrange
            Object.defineProperty(window, 'location', {
                value: { search: '?foo=1&bar=true&baz=qux&quux=corge' },
                writable: true,
            });

            // Act
            const result = getParams();

            // Assert
            expect(result).toEqual({ foo: '1', bar: 'true', baz: 'qux', quux: 'corge' });
        });
    });
});