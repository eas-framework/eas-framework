import StringTracker from '../../EasyDebug/StringTracker';

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