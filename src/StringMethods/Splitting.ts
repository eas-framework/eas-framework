export function SplitFirst(type: string, string: string) {
    const index = string.indexOf(type);
    return [string.substring(0, index), string.substring(index + type.length)];
}

export function CutTheLast(type: string, string: string) {
    return string.substring(0, string.lastIndexOf(type));
}