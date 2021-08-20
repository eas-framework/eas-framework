import StringTracker from '../EasyDebug/StringTracker';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import JSParser from './JSParser';
export declare class PageTemplate extends JSParser {
    private static CreateSourceMap;
    private static AddPageTemplate;
    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: StringAnyMap): Promise<StringTracker>;
    static AddAfterBuild(text: string, isDebug: boolean): string;
}
