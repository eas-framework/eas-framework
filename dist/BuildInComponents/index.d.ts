import StringTracker from '../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule, SessionInfo } from '../CompileCode/XMLHelpers/CompileTypes';
export declare const AllBuildIn: string[];
export declare function StartCompiling(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: SessionInfo): Promise<BuildInComponent>;
export declare function IsInclude(tagname: string): boolean;
export declare function finalizeBuild(pageData: StringTracker, sessionInfo: SessionInfo, fullCompilePath: string): Promise<StringTracker>;
export declare function handelConnectorService(type: string, thisPage: any, connectorArray: any[]): Promise<void> | Promise<boolean>;
