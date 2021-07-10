import StringTracker from '../../EasyDebug/StringTracker';
export interface tagDataObject {
    n: StringTracker;
    v: StringTracker;
    char?: StringTracker;
}
export interface tagDataObjectAsText {
    n: string;
    v: string;
}
export declare type StringNumberMap = {
    [key: string]: number;
};
export declare type StringAnyMap = {
    [key: string]: any;
};
export interface BuildInComponent {
    compiledString: StringTracker;
    checkComponents?: boolean;
}
export declare type CompileInFileFunc = (path: string, arrayType: string[], debugFromPage: string) => Promise<{
    CompiledData: string;
    dependenceObject: any;
}>;
export declare type BuildScriptWithoutModule = (code: StringTracker, pathName: string) => Promise<string>;
export declare type StringArrayOrObject = (string | {
    [key: string]: string;
})[];
