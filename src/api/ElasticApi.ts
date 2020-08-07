import { ApiHelper } from "./ApiHelper";
import { ElasticResponse } from "../types/ElasticResponse";
import { CampingElasticResponse } from "../types/CampingElasticResponse";

const makeAllFieldsRequired = (fields: string[]) => {
    return fields.map(f => ({
        exists: {
            field: f
        }
    }));
};

export const getElasticData = (endpoint: string, fields: string[]) => {
    const postData = {
        _source: fields,
        query: {
            bool: {
                must: makeAllFieldsRequired(fields)
            }
        }
    };

    return ApiHelper.postData<ElasticResponse<CampingElasticResponse>>(endpoint, postData)
        .then(result => {
            return result.hits.hits.map(h => ({ ...h._source, id: h._id })); 
        });
};