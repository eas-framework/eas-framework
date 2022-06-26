interface globalString<T> {
    indexOf(string: string): number;
    lastIndexOf(string: string): number;
    startsWith(string: string): boolean;
    substring(start: number, end?: number): T;
}

export function splitFirst<T extends globalString<T>>(string: T, type: string): T[] {
    const index = string.indexOf(type);

    if (index == -1)
        return [string];

    return [string.substring(0, index), string.substring(index + type.length)];
}

export function Capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function unicode(value: string) {
    let build = "";
    for (const char of value) {
        build += "\\u" + ("000" + char.charCodeAt(0).toString(16)).slice(-4);
    }
    return build;
}