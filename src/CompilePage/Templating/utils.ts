import StringTracker from "../../SourceTracker/StringTracker/StringTracker.js";
import {StringAnyMap} from '../../Settings/types.js';

export function normalizeText(text: StringTracker | string) {
    return text.replace(/\\/gi, '\\\\').replace(/`/gi, '\\`').replace(/\u0024/gi, '\\u0024');
}

export function normalizeTextSimpleQuotes(text: StringTracker | string) {
    return text.replace(/\\/gi, '\\\\').replace(/"/gi, '\\"');
}


const KEY_CASING_VALUE = 'value';
const KEY_CASING = `<%${KEY_CASING_VALUE}%>`;

export function simpleTextTemplate<T extends string | StringTracker>(text: T) {
    return function addValues(values: StringAnyMap): T {
        let copyText = text;

        for (let [key, value] of Object.entries(values)) {
            copyText = <any>copyText.replaceAll(
                KEY_CASING.replace(KEY_CASING_VALUE, key),
                value
            );
        }

        return copyText;
    };

}