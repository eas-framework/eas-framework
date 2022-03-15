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
    getValue?: (name: string) => string,
    addClass?: (name: string) => void
}

export interface tagDataObjectAsText {
    n: string,
    v: string
}

export type StringNumberMap = {[key: string]: number}

export type StringAnyMap = {[key: string]: any};


export interface BuildInComponent {
    compiledString: StringTracker,
    checkComponents?: boolean
}

export type CompileInFileFunc = (path: string, arrayType: string[], debugFromPage: string) => Promise<{CompiledData:StringTracker, dependenceObject:any}>;

export type BuildScriptWithoutModule = (code: StringTracker) => Promise<string>;

export type StringArrayOrObject = (string | {[key: string]: string})[];