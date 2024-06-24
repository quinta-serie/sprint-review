// FILEPATH: /c:/Users/Leonardo/Desktop/Projetos/mystic-mingles/packages/shared/services/src/array/array.spec.ts

import { higherThan } from './array';

describe('higherThan', () => {
    it('should handle strings correctly', () => {
        const arr = [
            { a: { b: 'apple' } },
            { a: { b: 'banana' } },
            { a: { b: 'cherry' } }
        ];

        const path = 'a.b';
        const result = higherThan(arr, path);

        expect(result).toEqual({ a: { b: 'cherry' } });
    });

    it('should handle negative numbers correctly', () => {
        const arr = [
            { a: { b: -1 } },
            { a: { b: -2 } },
            { a: { b: -3 } }
        ];

        const path = 'a.b';
        const result = higherThan(arr, path);

        expect(result).toEqual({ a: { b: -1 } });
    });

    it('should handle zero correctly', () => {
        const arr = [
            { a: { b: 0 } },
            { a: { b: -1 } },
            { a: { b: -2 } }
        ];

        const path = 'a.b';
        const result = higherThan(arr, path);

        expect(result).toEqual({ a: { b: 0 } });
    });

    it('should return error if property path does not exist', () => {
        const arr = [
            { a: { b: 1 } },
            { a: { b: 2 } },
            { a: { b: 3 } }
        ];

        const path = 'a.c';

        expect(() => higherThan(arr, path)).toThrow();
    });
});