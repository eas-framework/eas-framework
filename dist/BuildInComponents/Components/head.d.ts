import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent, StringAnyMap, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, buildScript: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<BuildInComponent>;
export declare function addFinalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap, fullCompilePath: string): Promise<StringTracker>;
