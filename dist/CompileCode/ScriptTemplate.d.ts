import StringTracker from '../EasyDebug/StringTracker';
import JSParser from './JSParser';
import { SessionBuild } from './Session';
export declare class PageTemplate extends JSParser {
    private static CreateSourceMap;
    private static AddPageTemplate;
    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: SessionBuild): Promise<StringTracker>;
    static AddAfterBuild(text: string, isDebug: boolean): string;
    static InPageTemplate(text: StringTracker, dataObject: any, fullPath: string): StringTracker;
}
