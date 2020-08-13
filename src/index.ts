require('dotenv').config();

import express from 'express';
import kmeans from 'ml-kmeans';
import BluebirdPromise from 'bluebird';
import { ElasticManager } from './api/ElasticApi';
import { flattenObject } from './utils/ObjectUtils';
import { mapPropsToNumericList } from './utils/CollectionUtils';
import { KMeansManager } from './KMeans/KMeansManager';
import { CampingElasticResponse } from './types/CampingElasticResponse';
// @ts-ignore is actually permitted
global.Promise = BluebirdPromise;

const exists = <T>(val?: T): val is T => val !== undefined;

const app = express();
const port = process.env.PORT || 8080;

const elasticSearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT;
const elasticSearchScrollEndpoint = process.env.ELASTICSEARCH_SCROLL_ENDPOINT;
const elasticSearchColumns = process.env.ELASTICSEARCH_COLUMNS;
const elasticSearchScrollSize = process.env.ELASTICSEARCH_SCROLL_SIZE;
const clusterTotal = process.env.MACHINE_LEARNING_CLUSTER_TOTAL;
if (!exists(elasticSearchEndpoint) || !exists(elasticSearchColumns) || !exists(clusterTotal) || !exists(elasticSearchScrollEndpoint)) {
  throw Error('Required env variables not provided');
}

const serveKmeans = (req: express.Request, res: express.Response) => {
  const elasticManager = new ElasticManager();
  const kmeansManager = new KMeansManager();

  elasticManager.getData<CampingElasticResponse[]>({
    endpoint: elasticSearchEndpoint,
    scrollEndpoint: elasticSearchScrollEndpoint,
    fields: elasticSearchColumns.split(','),
    scrollSize: elasticSearchScrollSize ? parseInt(elasticSearchScrollSize) : undefined
  })
    .then(r => {
      const collection = kmeansManager.storeIds(r);
      return collection.map(x => flattenObject(x));
    })
    .then(mapPropsToNumericList)
    .then(r => {
      const clusterOverview = kmeans(r, parseInt(clusterTotal));
      const clustersWithIds = kmeansManager.fieldIds.map((id, index) => ({ id, cluster: clusterOverview.clusters[index] }));

      // console.log(kmeansManager.fieldIds);
      // console.log(JSON.stringify(clusterOverview));
      res.json(clustersWithIds);
    })
    .catch(e => console.log(`Error: ${e}`));
};

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

app.get('/kmeans', serveKmeans);