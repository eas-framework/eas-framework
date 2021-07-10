import StringTracker from '../../EasyDebug/StringTracker';

export interface tagDataObject {
    n: StringTracker, // name
    v: StringTracker, // value
    char?: StringTracker // char type: " ' `
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

export type CompileInFileFunc = (path: string, arrayType: string[], debugFromPage: string) => Promise<{CompiledData:string, dependenceObject:any}>;

export type BuildScriptWithoutModule = (code: StringTracker, pathName: string) => Promise<string>;

export type StringArrayOrObject = (string | {[key: string]: string})[];