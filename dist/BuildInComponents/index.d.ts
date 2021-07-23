import StringTracker from '../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent, BuildScriptWithoutModule, StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
export declare function StartCompiling(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<BuildInComponent>;
export declare function IsInclude(tagname: string): boolean;
export declare function finalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap): StringTracker;
