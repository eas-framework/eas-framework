import {normalizeText} from "../utils.js";

export function addHTMLError(message: string) {
    return `<div style="color:red;text-align:left;font-size:16px;white-space:pre;border:solid 1px #000;display:inline-block;padding:10px;">${normalizeText(message)}</div>`;
}