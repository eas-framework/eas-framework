import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../../CompileCode/Session';
export default function BuildCode(language: string, tagData: tagDataObjectArray, LastSmallPath: string, BetweenTagData: StringTracker, pathName: string, InsertComponent: any, sessionInfo: SessionBuild): Promise<BuildInComponent>;
