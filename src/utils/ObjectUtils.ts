export const flattenObject = (obj: Object, keyName?: string) => {
    let flattendObj = {};

    Object.keys(obj).forEach(key => {
        const newKey = keyName ? `${keyName}.${key}` : key;
        if (typeof obj[key] === 'object') {
            flattendObj = { ...flattendObj, ...flattenObject(obj[key], newKey) };
        } else {
            flattendObj[newKey] = obj[key];
        }
    });

    return flattendObj;
};