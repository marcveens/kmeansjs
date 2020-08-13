import { ApiHelper } from './ApiHelper';
import { ElasticResponse } from '../types/ElasticResponse';

type ElasticDataProps = {
    endpoint: string;
    scrollEndpoint: string;
    fields: string[];
    scrollSize?: number;
};

export class ElasticManager {
    private elasticResults: any[] = [];

    public getData = <T extends any[]>(options: ElasticDataProps): Promise<T> => {
        const { endpoint, fields, scrollEndpoint, scrollSize } = options;

        const postData = {
            _source: fields,
            size: scrollSize || 750,
            // For performance reasons, see https://www.elastic.co/guide/en/elasticsearch/reference/7.8/paginate-search-results.html#scroll-search-results
            sort: [
                '_doc'
            ],
            query: {
                bool: {
                    must: this.makeAllFieldsRequired(fields)
                }
            }
        };

        return new Promise(resolve => {
            ApiHelper.postData<ElasticResponse<T>>(`${endpoint}?scroll=1m`, postData)
                .then(result => {
                    this.elasticResults = this.elasticResults.concat(result.hits.hits);

                    this.getElasticScrollData(scrollEndpoint, result._scroll_id).then(() => {
                        console.log('Done loading Elastic data, total docs: ', this.elasticResults.length);
                        resolve(this.elasticResults.map(h => ({ ...h._source, id: h._id })) as T);
                    });
                });
        });
    };

    private makeAllFieldsRequired = (fields: string[]) => {
        return fields.map(f => ({
            exists: {
                field: f
            }
        }));
    };

    private getElasticScrollData = <T>(endpoint: string, scrollId?: string) => {
        const getMoreResults = () => {
            return new Promise((resolve, reject) => {
                console.log('Fetch /scroll');
                ApiHelper.postData<ElasticResponse<T>>(endpoint, {
                    scroll: '1m',
                    scroll_id: scrollId
                }).then(result => {
                    this.elasticResults = this.elasticResults.concat(result.hits.hits);

                    // There is more to fetch
                    if (result.hits.hits.length) {
                        getMoreResults().then(resolve).catch(reject);
                    } else {
                        resolve();
                    }
                }).catch(reject);
            });
        };
        
        return getMoreResults();
    }
} 
