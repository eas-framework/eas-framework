import InsertComponent from './InsertComponent';
import { StringNumberMap, SessionInfo } from './XMLHelpers/CompileTypes';
export declare const Settings: {
    AddCompileSyntax: string[];
    plugins: any[];
};
export declare const Components: InsertComponent;
export declare function GetPlugin(name: string): any;
export declare function SomePlugins(...data: string[]): boolean;
export declare function isTs(): boolean;
export declare function Insert(data: string, fullPathCompile: string, pagePath: string, smallPath: string, isDebug: boolean, dependenceObject: StringNumberMap, debugFromPage: boolean, hasSessionInfo?: SessionInfo): Promise<string>;
