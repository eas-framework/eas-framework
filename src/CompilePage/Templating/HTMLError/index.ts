import { normalizeText } from "../utils.js";

export function addHTMLError(message: string) {
    return `<div style="color:red;text-align:left;font-size:16px;">${normalizeText(message)}</div>`;
}