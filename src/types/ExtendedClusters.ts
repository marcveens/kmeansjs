type ExtendedCluster = {
    id: string;
    cluster: number;
    meta: { [key: string]: string | number | boolean };
};

export type ExtendedClusters = ExtendedCluster[];