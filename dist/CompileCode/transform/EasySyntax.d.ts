export default class EasySyntax {
    private Build;
    load(code: string): Promise<void>;
    private actionStringImport;
    private actionStringExport;
    private actionStringImportAll;
    private actionStringExportAll;
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
    }): Promise<string>;
}
