import SourceMapStore from "../EasyDebug/SourceMapStore";
import { StringAnyMap } from "./XMLHelpers/CompileTypes";
export declare type setDataHTMLTag = {
    url: string;
    attributes?: StringAnyMap;
};
export declare type connectorArray = {
    type: string;
    name: string;
    sendTo: string;
    validator: string[];
    order?: string[];
    notValid?: string;
    message?: string | boolean;
    responseSafe?: boolean;
}[];
export declare type cacheComponent = {
    [key: string]: null | {
        mtimeMs?: number;
        value?: string;
    };
};
export declare type inTagCache = {
    style: string[];
    script: string[];
    scriptModule: string[];
};
export declare class SessionBuild {
    defaultPath: string;
    typeName: string;
    debug: boolean;
    connectorArray: connectorArray;
    private scriptURLSet;
    private styleURLSet;
    private inScriptStyle;
    headHTML: string;
    cache: inTagCache;
    cacheComponent: cacheComponent;
    compileRunTimeStore: StringAnyMap;
    constructor(defaultPath: string, typeName: string, debug: boolean);
    style(url: string, attributes?: StringAnyMap): void;
    script(url: string, attributes?: StringAnyMap): void;
    addScriptStyle(type: 'script' | 'style' | 'module', smallPath?: string): SourceMapStore;
    private addHeadTags;
    buildHead(): string;
    extends(from: SessionBuild): void;
}
