import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../../CompileCode/Session';
export default function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionBuild): Promise<BuildInComponent>;
