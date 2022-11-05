import PPath from "../../../../../../Settings/PPath.js";
import {StringAnyMap} from "../../../../../../Settings/types.js";
import {COMPONENT_READER} from "../../../../Components/CompBuilder.js";

export const IMPORT_SOURCE = 'importSource';
export const IMPORT_SOURCE_DIRECTORY = 'importSourceDirectory';
export const SPECIAL_ATTRIBUTES = [IMPORT_SOURCE, IMPORT_SOURCE_DIRECTORY, COMPONENT_READER];

/**
 * It takes an object, and returns a string of the object's key-value pairs, formatted as HTML
 * attributes
 * @param {StringAnyMap} attributes - The attributes to render.
 * @param {string[] | null} onlySome - This is an array of strings that are the only attributes you
 * want to render.
 * @param {boolean} [asObject] - If true, the attributes will be rendered as an object.
 * @returns A string of attributes
 */
export default function renderAttrs(attributes: StringAnyMap, onlySome: string[] | null, asObject ?: boolean): string {
    const values = [];
    for (const [key, value] of Object.entries(attributes)) {
        if (SPECIAL_ATTRIBUTES.includes(key) || onlySome.length && !onlySome.includes(key)) {
            continue;
        }

        if (typeof value === 'boolean' || value == null) {
            if (value) {
                values.push(key);
            }
            continue;
        }

        if (typeof value == 'string') {
            values.push(`${key}=${JSON.stringify(value)}`);
        } else if (asObject) {
            values.push(`${key}=(${JSON.stringify(value)})`);
        } else {
            values.push(`${key}="${JSON.stringify(value).replaceAll('"', '&#34;')}"`);
        }
    }

    return values.join(' ');
}

export function addImportSource(attributes: StringAnyMap, source: PPath): void {
    attributes[IMPORT_SOURCE] = source.small;
    attributes[IMPORT_SOURCE] = source.dirname.small;
}