import StringTracker from '../../EasyDebug/StringTracker';
export interface tagDataObject {
    n: StringTracker;
    v?: StringTracker;
    char?: StringTracker;
}
export interface tagDataObjectArray extends Array<tagDataObject> {
    have?: (name: string) => boolean;
    remove?: (name: string) => string;
    getValue?: (name: string) => string;
    addClass?: (name: string) => void;
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
    CompiledData: StringTracker;
    dependenceObject: any;
}>;
export declare type BuildScriptWithoutModule = (code: StringTracker) => Promise<string>;
export declare type StringArrayOrObject = (string | {
    [key: string]: string;
})[];
