import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent, StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../CompileCode/Session';
export default function BuildCode(path: string, LastSmallPath: string, isDebug: boolean, type: StringTracker, dataTag: tagDataObjectArray, dependenceObject: StringNumberMap, sessionInfo: SessionBuild): Promise<BuildInComponent>;
