import { SystemLog } from "../../Logger/BasicLogger.js";
import StringTracker from "../../SourceTracker/StringTracker/StringTracker.js";
import { closeTagError } from "../Templating/Components/Errors.js";
import { pool } from "./Pool.js";

function printErrors(text: StringTracker, errors: string) {
    for (const i of JSON.parse(errors).reverse()) {
        closeTagError(i.type_name, text.at(Number(i.index)))
    }
}

export async function findCloseChar(text: StringTracker, Search: string) {
    const [point, errors] = await pool.exec('FindCloseChar', [text.eq, Search]);
    printErrors(text, errors);

    return point;
}

export async function findCloseCharHTML(text: StringTracker, Search: string) {
    const [point, errors] = await pool.exec('FindCloseCharHTML', [text.eq, Search]);
    printErrors(text, errors);

    return point;
}