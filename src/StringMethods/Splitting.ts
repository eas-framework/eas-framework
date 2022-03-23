import StringTracker from '../EasyDebug/StringTracker';

interface globalString<T> {
    indexOf(string: string): number;
    lastIndexOf(string: string): number;
    startsWith(string: string): boolean;
    substring(start: number, end?: number): T;
}

export function SplitFirst<T extends globalString<T>>(type: string, string: T): T[] {
    const index = string.indexOf(type);

    if (index == -1)
        return [string];

    return [string.substring(0, index), string.substring(index + type.length)];
}

export function CutTheLast(type: string, string: string) {
    return string.substring(0, string.lastIndexOf(type));
}

export function Extension<T extends globalString<T>>(string: T) {
    return string.substring(string.lastIndexOf('.'));
}

export function trimType(type: string, string: string) {
    while (string.startsWith(type))
        string = string.substring(type.length);

    while (string.endsWith(type))
        string = string.substring(0, string.length - type.length);

    return string;
}

export function substringStart<T extends globalString<T>>(start: string, string: T): T {
    if(string.startsWith(start))
        return string.substring(start.length);
    return string;
}