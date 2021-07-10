import StringTracker, { StringTrackerDataInfo } from '../EasyDebug/StringTracker';
import { BaseReader } from './BaseReader/Reader';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
interface JSParserValues {
    type: 'text' | 'script' | 'none-track-script';
    text: StringTracker;
}
export default class JSParser extends BaseReader {
    start: string;
    text: StringTracker;
    end: string;
    type: string;
    path: string;
    values: JSParserValues[];
    constructor(text: StringTracker, path: string, start?: string, end?: string, type?: string);
    ReplaceValues(find: string, replace: string): void;
    findEndOfDefGlobal(text: StringTracker): any;
    ScriptWithInfo(text: StringTracker): StringTracker;
    findScripts(): void;
    static fixText(text: StringTracker | string): string | StringTracker;
    ReBuildText(): StringTracker;
    BuildAll(isDebug: boolean): StringTracker;
    static printError(message: string): string;
    static RunAndExport(text: StringTracker, path: string, isDebug: boolean): StringTracker;
    private static split2FromEnd;
    static RestoreTrack(text: string, defaultInfo: StringTrackerDataInfo): StringTracker;
}
export declare class PageTemplate extends JSParser {
    private static CreateSourceMap;
    private static AddPageTemplate;
    static AddLineNumbers(code: StringTracker): StringTracker;
    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: StringAnyMap): StringTracker;
    static AddAfterBuild(text: string, isDebug: boolean): string;
}
export declare class EnableGlobalReplace {
    private savedBuildData;
    private buildCode;
    private path;
    constructor(code: StringTracker, path: string);
    private ExtractAndSaveCode;
    private ParseOutsideOfComment;
    StartBuild(): string;
    private RestoreAsCode;
    RestoreCode(code: StringTracker): StringTracker;
}
export {};
