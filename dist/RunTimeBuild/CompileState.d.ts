export default class CompileState {
    private state;
    static filePath: string;
    constructor();
    get scripts(): string[];
    get pages(): string[][];
    get files(): string[];
    addPage(path: string, type: string): void;
    addImport(path: string): void;
    addFile(path: string): void;
    export(): Promise<boolean>;
    static checkLoad(): Promise<CompileState>;
}
