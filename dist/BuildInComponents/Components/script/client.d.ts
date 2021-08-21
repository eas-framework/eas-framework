import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionInfo } from '../../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(language: string, tagData: tagDataObjectArray, BetweenTagData: StringTracker, pathName: string, InsertComponent: any, sessionInfo: SessionInfo): Promise<BuildInComponent>;
