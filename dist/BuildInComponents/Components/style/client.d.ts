import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionInfo } from '../../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionInfo): Promise<BuildInComponent>;
