export type CampingElasticResponse = {
    id: string;
    search: {
        country: string;
        totalCapacity: number;
        standSize: number;
        anwbScore: number;
    };
    traits: {
        hasPitch: boolean;
        forBeach: boolean;
    };
    location: {
        region: string;
    };
    facilities: {
        poolsInfo: {
            waterSlide: boolean;
            waterPark: boolean;
        };
    };
    capacity: {
        sizeIndication: number;
        total: number;
    };
};