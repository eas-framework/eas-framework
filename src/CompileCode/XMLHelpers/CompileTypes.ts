import StringTracker from '../../EasyDebug/StringTracker';

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
export type StringMap = {[key: string]: string};

export interface BuildInComponent {
    compiledString: StringTracker,
    checkComponents?: boolean
}

export type CompileInFileFunc = (path: string, arrayType: string[], debugFromPage: string) => Promise<{CompiledData:StringTracker, dependenceObject:any}>;

export type BuildScriptWithoutModule = (code: StringTracker) => Promise<StringTracker> | StringTracker;

export type StringArrayOrObject = (string | {[key: string]: string})[];