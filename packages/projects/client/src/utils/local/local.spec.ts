
import { Local } from './';

describe('Window Local', () => {
    it('should check that has method returns true when key exists in localStorage', () => {
        const local = new Local();

        localStorage.setItem('test_key', 'test_value');

        expect(local.has('test_key')).toBe(true);
    });

    it('should check that has method returns false when key does not exist in localStorage', () => {
        const local = new Local();

        expect(local.has('non_existent_key')).toBe(false);
    });

    it('should check that get method returns the correct value when key exists in localStorage', () => {
        const local = new Local();

        localStorage.setItem('test_key', 'test_value');

        expect(local.get('test_key')).toBe('test_value');
    });

    it('should check that set method sets the correct value in localStorage', () => {
        const local = new Local();

        local.set('test_key', 'test_value');

        expect(localStorage.getItem('test_key')).toBe('test_value');
    });

    it('should check that clear method clears all items from localStorage', () => {
        const local = new Local();

        localStorage.setItem('test_key1', 'test_value1');
        localStorage.setItem('test_key2', 'test_value2');
        local.clear();

        expect(localStorage.getItem('test_key1')).toBe(null);
        expect(localStorage.getItem('test_key2')).toBe(null);
    });

    it('should check that the get method returns empty string when not in browser', () => {
        const local = new Local();
        const key = 'test_key';
        const value = 'test_value';

        localStorage.setItem(key, value);
        // @ts-ignore
        delete global.window;

        expect(local.get(key)).toEqual(null);
    });
});
