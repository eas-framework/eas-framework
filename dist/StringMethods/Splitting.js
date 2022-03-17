export function SplitFirst(type, string) {
    const index = string.indexOf(type);
    if (index == -1)
        return [string];
    return [string.substring(0, index), string.substring(index + type.length)];
}
export function CutTheLast(type, string) {
    return string.substring(0, string.lastIndexOf(type));
}
export function trimType(type, string) {
    while (string.startsWith(type))
        string = string.substring(type.length);
    while (string.endsWith(type))
        string = string.substring(0, string.length - type.length);
    return string;
}
export function substringStart(start, string) {
    if (string.startsWith(start))
        return string.substring(start.length);
    return string;
}
//# sourceMappingURL=Splitting.js.map