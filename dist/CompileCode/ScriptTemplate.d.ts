import StringTracker from '../EasyDebug/StringTracker';
import { SessionInfo } from '../CompileCode/XMLHelpers/CompileTypes';
import JSParser from './JSParser';
export declare class PageTemplate extends JSParser {
    private static CreateSourceMap;
    private static AddPageTemplate;
    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: SessionInfo): Promise<StringTracker>;
    static AddAfterBuild(text: string, isDebug: boolean): string;
    static InPageTemplate(text: StringTracker, dataObject: any, fullPath: string): StringTracker;
}
