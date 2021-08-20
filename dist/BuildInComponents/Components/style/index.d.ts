import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { StringAnyMap } from '../../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent>;
