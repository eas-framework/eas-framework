export default class CompileState {
    private state;
    static filePath: string;
    constructor();
    get scripts(): string[];
    addPage(path: string): void;
    addImport(path: string): void;
    export(): Promise<boolean>;
    static checkLoad(): Promise<CompileState>;
}
