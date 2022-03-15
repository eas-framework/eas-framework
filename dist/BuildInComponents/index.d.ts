import StringTracker from '../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule } from '../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../CompileCode/Session';
export declare const AllBuildIn: string[];
export declare function StartCompiling(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: SessionBuild): Promise<BuildInComponent>;
export declare function IsInclude(tagname: string): boolean;
export declare function finalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild, fullCompilePath: string): Promise<StringTracker>;
export declare function handelConnectorService(type: string, thisPage: any, connectorArray: any[]): Promise<void> | Promise<boolean>;
