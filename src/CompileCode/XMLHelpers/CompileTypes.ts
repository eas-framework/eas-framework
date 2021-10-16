import StringTracker from '../../EasyDebug/StringTracker';
import SourceMapStore from '../../EasyDebug/SourceMapStore';

export interface tagDataObject {
    n: StringTracker, // name
    v?: StringTracker, // value
    char?: StringTracker // char type: " ' `
}

export interface tagDataObjectArray extends Array<tagDataObject> {
    have?: (name: string) => boolean
    remove?: (name: string) => string
    getValue?: (name: string) => string
}

export interface tagDataObjectAsText {
    n: string,
    v: string
}

export type StringNumberMap = {[key: string]: number}

export type StringAnyMap = {[key: string]: any};

export type setDataHTMLTag = {
    url: string,
    attributes?: StringAnyMap
}

export type SessionInfo = {
    connectorArray: {
        type: string,
        name: string,
        sendTo: string,
        validator: string[],
        order?: string[],
        notValid?: string,
        message?: boolean,
        responseSafe?: boolean
    }[],
    scriptURLSet: setDataHTMLTag[]
    styleURLSet: setDataHTMLTag[]
    style: SourceMapStore
    script: SourceMapStore
    scriptModule: SourceMapStore,
    headHTML: string,
    typeName: string,
    cache: {
        style: string[]
        script: string[]
        scriptModule: string[]
    },
    cacheComponent: {
        [key: string]: null | {
            mtimeMs?: number,
            value?: string
        }
    }
}


export interface BuildInComponent {
    compiledString: StringTracker,
    checkComponents?: boolean
}

export type CompileInFileFunc = (path: string, arrayType: string[], debugFromPage: string) => Promise<{CompiledData:string, dependenceObject:any}>;

export type BuildScriptWithoutModule = (code: StringTracker, pathName: string) => Promise<string>;

export type StringArrayOrObject = (string | {[key: string]: string})[];