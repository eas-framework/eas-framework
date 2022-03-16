declare function getDirname(url: string): string;
declare const SystemData: string;
declare const workingDirectory: string;
declare const getTypes: {
    Static: string[];
    Logs: string[];
    node_modules: string[];
    readonly WWW: string[];
};
declare const BasicSettings: {
    pageTypes: {
        page: string;
        model: string;
        component: string;
    };
    pageTypesArray: any[];
    pageCodeFile: {
        page: string[];
        model: string[];
        component: string[];
    };
    pageCodeFileArray: any[];
    partExtensions: string[];
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
    relative(fullPath: string): string;
};
declare function filesInDirectory(path: any, output: any, pathMore?: string): Promise<void>;
declare function DeleteInDirectory(path: any): Promise<void>;
export { getDirname, SystemData, workingDirectory, filesInDirectory, DeleteInDirectory, getTypes, BasicSettings };
