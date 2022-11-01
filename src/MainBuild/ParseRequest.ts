import { multipartType } from 'formidable/src/plugins/multipart.js';
import { querystringType } from 'formidable/src/plugins/querystring.js';

export function firstValuesOrFullArray(form, fields, exceptions = []) {
    /**
     * If there is only one filed in the array then return it else return the array
     */
    if (form.type !== querystringType && form.type !== multipartType) {
        return fields;
    }

    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => {
            if (exceptions.includes(key) || !Array.isArray(value)) {
                return [key, value];
            }
            return [key, value.length === 1 ? value[0] : value];
        }),
    );
};