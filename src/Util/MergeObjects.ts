
/**
 * It copies the nested properties of a JSON object to another object, but only the properties that are
 * specified in the rules array
 * @param {any} to - The object to be copied to
 * @param {any} json - The object to be copied
 * @param {string[]} rules - The rules for the copy, if the rulesType is 'ignore', then the rules will
 * be ignored, if the rulesType is 'only', then the rules will be the only ones copied.
 * @param {'ignore' | 'only'} [rulesType=ignore] - 'ignore' | 'only' = 'ignore'
 * @returns is something copied
 */
export function copyJSON(to: any, json: any, rules: string[] = [], rulesType: 'ignore' | 'only' = 'ignore') {
    if(!json) return false;
    let hasImplanted = false;
    for (const i in json) {
        const include = rules.includes(i);
        if (rulesType == 'only' && include || rulesType == 'ignore' && !include) {
            hasImplanted = true;
            Object.assign(to[i], json[i]);
        }
    }
    return hasImplanted;
}

/**
 * Merge the nested objects in the from object into the nested objects in the target object.
 * @param {any} target - any - The target object to merge into.
 * @param from - {[key: string]: {[key: string]: any}}
 */
export function mergeNested1(target: any, from?: {[key: string]: {[key: string]: any}}){
    if(!from) return;
    for(const i in from){
        Object.assign(target[i], from[i]);
    }
}