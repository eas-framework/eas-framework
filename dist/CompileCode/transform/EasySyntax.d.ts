export default class EasySyntax {
    private Build;
    constructor(code: string);
    private BuildImportType;
    private BuildInOneWord;
    private replaceWithSpace;
    private Define;
    private BuildInAsFunction;
    BuildImports(defineData: {
        [key: string]: string;
    }): void;
    BuiltString(): string;
    static BuildAndExportImports(code: string, defineData?: {
        [key: string]: string;
    }): string;
}
