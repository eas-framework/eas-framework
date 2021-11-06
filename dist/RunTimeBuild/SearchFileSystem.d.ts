declare function getDirname(url: string): string;
declare const SystemData: string;
declare const workingDirectory: string;
declare const getTypes: {
    Static: string[];
    Logs: string[];
};
declare const BasicSettings: {
    pageTypes: {
        page: string;
        model: string;
        component: string;
    };
    pageTypesArray: any[];
    ReqFileTypes: {
        js: string;
        ts: string;
        'api-ts': string;
        'api-js': string;
    };
    ReqFileTypesArray: any[];
    WebSiteFolder: string;
    readonly fullWebSitePath: string;
    readonly tsConfig: string;
    tsConfigFile(): Promise<any>;
};
declare function filesInDirectory(path: any, output: any, pathMore?: string): Promise<void>;
declare function DeleteInDirectory(path: any): Promise<void>;
declare const PagesInfo: any;
declare function UpdatePageDependency(path: string, o: any): Promise<void>;
declare function ClearPagesDependency(): void;
declare function CheckDependencyChange(path: string): Promise<boolean>;
export { getDirname, SystemData, workingDirectory, filesInDirectory, DeleteInDirectory, getTypes, BasicSettings, PagesInfo, ClearPagesDependency, UpdatePageDependency, CheckDependencyChange };
