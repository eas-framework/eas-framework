export declare function RemoveEndType(string: string): string;
export declare function FastCompile(path: string, arrayType: string[]): Promise<void>;
export declare function compileAll(): Promise<() => Promise<void>>;
