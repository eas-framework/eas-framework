import StringTracker from "../../SourceTracker/StringTracker/StringTracker";

export function normalizeText(text: StringTracker | string) {
    return text.replace(/\\/gi, '\\\\').replace(/`/gi, '\\`').replace(/\u0024/gi, '\\u0024');
}

export function normalizeTextSimpleQuotes(text: StringTracker | string) {
    return text.replace(/\\/gi, '\\\\').replace(/"/gi, '\\"');
}