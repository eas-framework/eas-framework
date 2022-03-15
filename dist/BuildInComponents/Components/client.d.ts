import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../CompileCode/Session';
export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: SessionBuild): Promise<BuildInComponent>;
