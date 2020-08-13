require('dotenv').config();

// The idea
// - Fetch results from Elasticsearch (only columns that are used)
// - Ditch all columns with incomplete values (either Node or Elasticsearch)
// - Transform all string and boolean values to integers
// - run kmeans

import kmeans from 'ml-kmeans';
import BluebirdPromise from 'bluebird';
import { getElasticData } from './api/ElasticApi';
import { flattenObject } from './utils/ObjectUtils';
import { mapPropsToNumericList } from './utils/CollectionUtils';
// @ts-ignore is actually permitted
global.Promise = BluebirdPromise;

const exists = <T>(val?: T): val is T => val !== undefined;

const elasticSearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT;
const elasticSearchColumns = process.env.ELASTICSEARCH_COLUMNS;
const elasticSearchTotalResults = process.env.ELASTICSEARCH_TOTAL_RESULTS;
const clusterTotal = process.env.MACHINE_LEARNING_CLUSTER_TOTAL;
if (!exists(elasticSearchEndpoint) || !exists(elasticSearchColumns) || !exists(clusterTotal) || !exists(elasticSearchTotalResults)) {
  throw Error('Required env variables not provided');
}

const init = () => {
  getElasticData(elasticSearchEndpoint, elasticSearchColumns.split(','), parseInt(elasticSearchTotalResults))
    .then(r => r.map(c => flattenObject(c)))
    .then(mapPropsToNumericList)
    .then(r => {
      const clusters = kmeans(r, parseInt(clusterTotal));

      console.log(JSON.stringify(clusters));
    })
    .catch(e => console.log(`Error: ${e}`));
};

if (process.argv.indexOf('--init') > -1) {
  init();
}