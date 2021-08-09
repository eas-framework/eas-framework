import StringTracker from '../EasyDebug/StringTracker';

interface globalString<T> {
    indexOf(string: string): number;
    substring(start: number, end?: number): T;
}

export function SplitFirst<T extends globalString<T>>(type: string, string: T): T[] {
    const index = string.indexOf(type);
    return [string.substring(0, index), string.substring(index + type.length)];
}

export function CutTheLast(type: string, string: string) {
    return string.substring(0, string.lastIndexOf(type));
}