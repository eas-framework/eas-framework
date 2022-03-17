interface globalString<T> {
    indexOf(string: string): number;
    startsWith(string: string): boolean;
    substring(start: number, end?: number): T;
}
export declare function SplitFirst<T extends globalString<T>>(type: string, string: T): T[];
export declare function CutTheLast(type: string, string: string): string;
export declare function trimType(type: string, string: string): string;
export declare function substringStart<T extends globalString<T>>(start: string, string: T): T;
export {};
