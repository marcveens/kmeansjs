import path from 'path';
import { ApiHelper } from '../api/ApiHelper';
import { ExtendedClusters } from '../types/ExtendedClusters';
import { getTotalClusters, getClusterSize, getEqualColumnsPerCluster, getEqualColumnsCountPerCluster, getTotalColumnsPerItem } from './ClusterStats';


const getStats = (clusters: ExtendedClusters) => {
    return {        
        totalColumnsPerItem: getTotalColumnsPerItem(clusters),
        totalClusters: getTotalClusters(clusters),
        minClusterSize: getClusterSize(clusters).min,
        maxClusterSize: getClusterSize(clusters).max,
        meanClusterSize: getClusterSize(clusters).mean,
        minEqualColumnsPerCluster: getEqualColumnsPerCluster(clusters).min,
        maxEqualColumnsPerCluster: getEqualColumnsPerCluster(clusters).max,
        meanEqualColumnsPerCluster: getEqualColumnsPerCluster(clusters).mean,
        equalColumnsCountPerCluster: getEqualColumnsCountPerCluster(clusters)
    };
};

export const ServeClusterAnalysis = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const clusters = await ApiHelper.getJsonFile<ExtendedClusters>(path.resolve(__dirname, 'data/clusters.json'));
            const stats = getStats(clusters);

            resolve(stats);
        } catch (e) {
            reject(e);
        };
    });
};