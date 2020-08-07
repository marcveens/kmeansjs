import { flattenObject } from "../ObjectUtils";

describe('ObjectUtils', () => {
    it('should flatten nested object', () => {
        // arrange
        const src = {
            a: 1,
            b: {
                c: 2,
                d: 3,
                e: [
                    'a',
                    'b'
                ]
            }
        };

        const expectedOutput = {
            a: 1,
            'b.c': 2,
            'b.d': 3,
            'b.e.0': 'a',
            'b.e.1': 'b'
        };

        // act + assert
        expect(flattenObject(src)).toStrictEqual(expectedOutput);
    });
});