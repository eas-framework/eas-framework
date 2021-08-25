export function SplitFirst(type, string) {
    const index = string.indexOf(type);
    if (index == -1)
        return [string];
    return [string.substring(0, index), string.substring(index + type.length)];
}
export function CutTheLast(type, string) {
    return string.substring(0, string.lastIndexOf(type));
}
