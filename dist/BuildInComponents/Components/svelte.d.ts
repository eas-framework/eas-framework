import { tagDataObjectArray, BuildInComponent, StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionInfo } from '../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(path: string, LastSmallPath: string, isDebug: boolean, dataTag: tagDataObjectArray, dependenceObject: StringNumberMap, sessionInfo: SessionInfo): Promise<BuildInComponent>;
