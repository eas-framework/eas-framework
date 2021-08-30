interface globalString<T> {
    indexOf(string: string): number;
    substring(start: number, end?: number): T;
}
export declare function SplitFirst<T extends globalString<T>>(type: string, string: T): T[];
export declare function CutTheLast(type: string, string: string): string;
export declare function trimType(type: string, string: string): string;
export {};
