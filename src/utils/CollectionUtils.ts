type Collection = { [key: string]: string | number | boolean }[];
type Cache = { [key: string]: string[] };
type PropNames = string[];
type NumericList = number[];
type StringIndexReturn = {
    cache: Cache;
    index: number;
};

// See if the string value is already cached, if so return the index
// If not cached, add to cache and return index
const getIndexOfStringValue = (cache: Cache, key: string, value: string): StringIndexReturn => {
    if (cache[key] && cache[key].find(x => x === value)) {
        return { cache, index: cache[key].indexOf(value) };
    }

    if (!cache[key]) {
        cache[key] = [];
    }

    if (!cache[key].find(x => x === value)) {
        cache[key].push(value);
    }

    return getIndexOfStringValue(cache, key, value);
};

/**
* Map a collection to a numeric list. Created so k-means algorithm can handle collections
*/
export const mapPropsToNumericList = (collection: Collection) => {
    const endList: number[][] = [];
    let stringCache: Cache = {};

    collection.forEach(obj => {
        const collectionList: number[] = [];

        Object.keys(obj).forEach(key => {
            const value = obj[key];
            let endValue = 0;

            if (typeof value === 'string') {
                const { cache, index } = getIndexOfStringValue(stringCache, key, value);
                stringCache = cache;
                endValue = index;
            } else if (typeof value === 'boolean') {
                endValue = value ? 1 : 0;
            } else if (typeof value === 'number') {
                endValue = value;
            }

            collectionList.push(endValue);
        });

        endList.push(collectionList);
    });

    return endList;
};