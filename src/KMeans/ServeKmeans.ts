import kmeans from 'ml-kmeans';
import { ElasticManager } from '../api/ElasticApi';
import { flattenObject } from '../utils/ObjectUtils';
import { mapPropsToNumericList } from '../utils/CollectionUtils';
import { KMeansManager } from './KMeansManager';
import { CampingElasticResponse } from '../types/CampingElasticResponse';

const exists = <T>(val?: T): val is T => val !== undefined;

const elasticSearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT;
const elasticSearchScrollEndpoint = process.env.ELASTICSEARCH_SCROLL_ENDPOINT;
const elasticSearchColumns = process.env.ELASTICSEARCH_COLUMNS;
const elasticSearchScrollSize = process.env.ELASTICSEARCH_SCROLL_SIZE;
const elasticSearchScrollMax = process.env.ELASTICSEARCH_SCROLL_MAX;
const clusterTotal = process.env.MACHINE_LEARNING_CLUSTER_TOTAL;
if (!exists(elasticSearchEndpoint) || !exists(elasticSearchColumns) || !exists(clusterTotal) || !exists(elasticSearchScrollEndpoint)) {
    throw Error('Required env variables not provided');
}

export const ServeKmeans = () => {
    return new Promise((resolve, reject) => {
        ServeKmeansExtended()
            .then(collection => {
                const simpleCollection = (collection || []).map(c => ({ id: c.id, cluster: c.cluster }));

                resolve(simpleCollection);
            })
            .catch(e => reject(e));
    });
};

export const ServeKmeansExtended = () => {
    const elasticManager = new ElasticManager();
    const kmeansManager = new KMeansManager();

    return elasticManager.getData<CampingElasticResponse[]>({
        endpoint: elasticSearchEndpoint,
        scrollEndpoint: elasticSearchScrollEndpoint,
        fields: elasticSearchColumns.split(','),
        scrollSize: elasticSearchScrollSize ? parseInt(elasticSearchScrollSize) : undefined,
        scrollMax: elasticSearchScrollMax ? parseInt(elasticSearchScrollMax) : undefined
    })
        .then(r => {
            const collection = kmeansManager.storeIds(r);
            return collection.map(x => flattenObject(x));
        })
        .then(r => {
            // ID shouldn't be used in kmeans algorithm
            const collectionWithoutIds = JSON.parse(JSON.stringify(r)).map(x => { x['id'] = undefined; return x; });

            return {
                collection: r,
                flatList: mapPropsToNumericList(collectionWithoutIds),
            };
        })
        .then(r => {
            const clusterOverview = kmeans(r.flatList, parseInt(clusterTotal));
            const clustersWithIds = kmeansManager.fieldIds.map((id, index) => ({
                id,
                cluster: clusterOverview.clusters[index],
                meta: r.collection.find(x => x['id'] === id)
            }));

            return clustersWithIds;
        })
        .catch(e => console.log(`Error: ${e}`));
};