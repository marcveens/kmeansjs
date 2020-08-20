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

app.get('/kmeans', (req, res) => ServeKmeans().then(results => res.send(results)));
app.get('/kmeans-extended', (req, res) => ServeKmeansExtended().then(results => res.send(results)));
app.get('/cluster-analysis', (req, res) => ServeClusterAnalysis().then(results => res.send(results)));