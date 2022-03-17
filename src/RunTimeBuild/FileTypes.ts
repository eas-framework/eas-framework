export function isFileType(types: string[], name: string) {
    name = name.toLowerCase();

    for (const type of types) {
        if (name.endsWith('.' + type)) {
            return true;
        }
    }
    return false;
}

export function RemoveEndType(string: string) {
    return string.substring(0, string.lastIndexOf('.'));
}