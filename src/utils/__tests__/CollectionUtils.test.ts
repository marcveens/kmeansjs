import { mapPropsToNumericList } from "../CollectionUtils";

describe('ArrayUtils', () => {
    it('should convert collection to numeric list', () => {
        // arrange
        const input = [
            {
                country: 'Noorwegen',
                region: 'a',
                standSize: 2,
                totalCapacity: 5,
                forBeach: false
            },
            {
                country: 'Germany',
                region: 'b',
                standSize: 2,
                totalCapacity: 10,
                forBeach: true
            },
            {
                country: 'Noorwegen',
                region: 'c',
                standSize: 24,
                totalCapacity: 0,
                forBeach: true
            },
        ];

        const expectedOutput = [
            [0, 0, 2, 5, 0],
            [1, 1, 2, 10, 1],
            [0, 2, 24, 0, 1]
        ];

        // act + assert
        expect(mapPropsToNumericList(input)).toStrictEqual(expectedOutput);
    });
});