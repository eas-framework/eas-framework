import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionInfo, BuildScriptWithoutModule } from '../../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, buildScript: BuildScriptWithoutModule, sessionInfo: SessionInfo): Promise<BuildInComponent>;
