import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../CompileCode/Session';
export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, buildScript: BuildScriptWithoutModule, sessionInfo: SessionBuild): Promise<BuildInComponent>;
export declare function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild): StringTracker;
export declare function handelConnector(thisPage: any, connectorInfo: any): Promise<void>;
