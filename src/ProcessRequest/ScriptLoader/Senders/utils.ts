import {StringAnyMap} from '../../../Settings/types.js';

/**
 * Cache function response data
 * @param method the method to cache
 * @param useCache return na unique id form the function argument, if you want to cache the value
 */
export function cacheFunc<T>(method: (...args: any) => T, useCache: (...data: any) => string | void) {
    const cacheData: StringAnyMap = {};
    return async (...args): Promise<T> => {
        const cacheId = useCache(...args);
        if (cacheId && cacheData[cacheId]) {
            return cacheData[cacheId];
        }

        let response = method(...args);

        if(cacheId) {
            cacheData[cacheId] = response; // make sure that only onc call can execute at a time when cache is on
            cacheData[cacheId] = response = await response;
        }

        return response;
    };
}

/**
 * Extract and delete value from an object
 * @param obj
 * @param value
 */
export function extractValue(obj: any, value: string) {
    const extract = obj[value];
    obj[value] = null;
    delete obj[value];

    return extract;
}