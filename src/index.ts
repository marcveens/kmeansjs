// The idea
// - Fetch results from Elasticsearch (only columns that are used)
// - Ditch all columns with incomplete values (either Node or Elasticsearch)
// - Transform all string and boolean values to integers
// - run kmeans

import kmeans from 'ml-kmeans';

// let data = [['Duitsland', false, false, true], ['Duitsland', false, false, false], ['Nederland', true, true, true], ['Nederland', true, false, true]];
let data = [[12], [25], [13], [25], [25]];

const init = () => {
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