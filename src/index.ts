require('dotenv').config();

// The idea
// - Fetch results from Elasticsearch (only columns that are used)
// - Ditch all columns with incomplete values (either Node or Elasticsearch)
// - Transform all string and boolean values to integers
// - run kmeans

import kmeans from 'ml-kmeans';
import { ApiHelper } from './api/ApiHelper';

const elasticSearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT;
const elasticSearchColumns = process.env.ELASTICSEARCH_COLUMNS;
if (!elasticSearchEndpoint || !elasticSearchColumns) {
  throw Error('Required env variables not provided');
}

// let data = [['Duitsland', false, false, true], ['Duitsland', false, false, false], ['Nederland', true, true, true], ['Nederland', true, false, true]];
let data = [[12], [25], [13], [25], [25]];

const init = async () => {
  const results = await ApiHelper.postData(elasticSearchEndpoint, {});
  console.log(results);

  let ans = kmeans(data, 2);
  console.log(ans, ans.centroids[0]);
};
/*
KMeansResult {
  clusters: [ 0, 0, 1, 1 ],
  centroids: 
   [ { centroid: [ 1, 1.5, 1 ], error: 0.25, size: 2 },
     { centroid: [ -1, -1, -1.25 ], error: 0.0625, size: 2 } ],
  converged: true,
  iterations: 1
}
*/

if (process.argv.indexOf('--init') > -1) {
  init();
}