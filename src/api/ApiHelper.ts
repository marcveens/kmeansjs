import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import BluebirdPromise from 'bluebird';
fetch.Promise = BluebirdPromise.Promise;

export class ApiHelper {
    public static async postData<ReturnT>(url: string, data: Object): Promise<ReturnT> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw response;
            }

            if (response.body) {
                const body = response.json();
                return body as any;
            }
        } catch (e) {
            console.error(`API call '${url}' fails with code: ${e.statusCode}. Exception: ${e.toString()}`);

            throw e;
        }

        throw new Error(`API call POST '${url}' fails to return a result.`);
    }

    public static async getJsonFile<ReturnT>(url: string): Promise<ReturnT> {
        try {
            const rawData = await fs.readFile(url, 'utf8');
            const data = JSON.parse(rawData);

            return data;
        } catch (e) {
            console.error(`File fetch '${url}' fails with code: ${e.statusCode}. Exception: ${e.toString()}`);

            throw e;
        }
    }
}