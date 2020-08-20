import fs from 'fs';
import path from 'path';

export const ServeClusterAnalysis = () => {
    fs.readFile(path.resolve(__dirname, 'data/clusters.json'), 'utf8', (err, data) => {
        if (err) throw err;
        
        console.log(data);
    });

    return Promise.resolve('test');
};