import { normalizeText } from "../utils";

export function addHTMLError(message: string) {
    return `<div style="color:red;text-align:left;font-size:16px;">${normalizeText(message)}</div>`;
}