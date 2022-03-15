import InsertComponent from './InsertComponent';
import StringTracker from '../EasyDebug/StringTracker';
import { StringNumberMap } from './XMLHelpers/CompileTypes';
import { SessionBuild } from './Session';
export declare const Settings: {
    AddCompileSyntax: any[];
    plugins: any[];
    BasicCompilationSyntax: string[];
};
export declare const Components: InsertComponent;
export declare function GetPlugin(name: string): any;
export declare function SomePlugins(...data: string[]): boolean;
export declare function isTs(): boolean;
export declare function Insert(data: string, fullPathCompile: string, pagePath: string, smallPath: string, isDebug: boolean, dependenceObject: StringNumberMap, nestedPage?: boolean, nestedPageData?: string, sessionInfo?: SessionBuild): Promise<string | StringTracker>;
