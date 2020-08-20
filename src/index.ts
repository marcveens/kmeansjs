require('dotenv').config();

import express from 'express';
import BluebirdPromise from 'bluebird';
import { ServeClusterAnalysis } from './ClusterAnalysis/ServeClusterAnalysis';
import { ServeKmeans, ServeKmeansExtended } from './KMeans/ServeKmeans';
// @ts-ignore is actually permitted
global.Promise = BluebirdPromise;

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

app.get('/kmeans', (req, res, next) =>
  ServeKmeans()
    .then(results => res.send(results))
    .catch(next)
);

app.get('/kmeans-extended', (req, res, next) =>
  ServeKmeansExtended()
    .then(results => res.send(results))
    .catch(next)
);

app.get('/cluster-analysis', (req, res, next) =>
  ServeClusterAnalysis()
    .then(results => res.send(`<pre>${JSON.stringify(results, null, 3)}</pre>`))
    .catch(next)
);