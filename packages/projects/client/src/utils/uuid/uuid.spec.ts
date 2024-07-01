import { uuid } from './uuid';

describe('uuid_function', () => {
    it('should check that the generated UUID has the correct format', () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8|9|aA|bB][0-9a-f]{3}-[0-9a-f]{12}$/;
    
        expect(uuid()).toMatch(uuidRegex);
    });

    it('should check that the generated UUID has timestamp correct', () => {
        const generatedUuid = uuid();
        const timestamp = parseInt(generatedUuid.split('-')[0], 16);
    
        expect(timestamp).toBeLessThanOrEqual(new Date().getTime());
    });

    it('should check that the generated UUID is greater than minimum random value', () => {
        const result = uuid();
        const random = parseInt(result.split('-')[3], 16);
    
        expect(random).toBeGreaterThanOrEqual(0x8000);
    });

    it('should check that the generated UUID is less than maximum random value', () => {
        const result = uuid();
        const random = parseInt(result.split('-')[3], 16);
    
        expect(random).toBeLessThanOrEqual(0xbfff);
    });

    it('should check that multiple generated UUIDs are unique', () => {
        const uuid1 = uuid();
        const uuid2 = uuid();
    
        expect(uuid1).not.toBe(uuid2);
    });
});
