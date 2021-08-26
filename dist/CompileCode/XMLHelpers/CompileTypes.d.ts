import StringTracker from '../../EasyDebug/StringTracker';
import SourceMapStore from '../../EasyDebug/SourceMapStore';
export interface tagDataObject {
    n: StringTracker;
    v?: StringTracker;
    char?: StringTracker;
}
export interface tagDataObjectArray extends Array<tagDataObject> {
    have?: (name: string) => boolean;
    remove?: (name: string) => string;
    getValue?: (name: string) => string;
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
export declare type setDataHTMLTag = {
    url: string;
    attributes?: StringAnyMap;
};
export declare type SessionInfo = {
    connectorArray: {
        type: string;
        name: string;
        sendTo: string;
        validator: string[];
        order?: string[];
        notValid?: string;
        message?: boolean;
        responseSafe?: boolean;
    }[];
    scriptURLSet: setDataHTMLTag[];
    styleURLSet: setDataHTMLTag[];
    style: SourceMapStore;
    script: SourceMapStore;
    scriptModule: SourceMapStore;
    headHTML: string;
    typeName: string;
    cache: {
        style: string[];
        script: string[];
        scriptModule: string[];
    };
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
