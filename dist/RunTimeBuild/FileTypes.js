export function isFileType(types, name) {
    name = name.toLowerCase();
    for (const type of types) {
        if (name.endsWith('.' + type)) {
            return true;
        }
    }
    return false;
}
export function RemoveEndType(string) {
    return string.substring(0, string.lastIndexOf('.'));
}
//# sourceMappingURL=FileTypes.js.map