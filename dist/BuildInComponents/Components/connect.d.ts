import StringTracker from '../../EasyDebug/StringTracker';
import type { tagDataObjectArray, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../CompileCode/Session';
export default function BuildCode(LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, isDebug: boolean, { SomePlugins }: {
    SomePlugins: any;
}, sessionInfo: SessionBuild): Promise<BuildInComponent>;
export declare function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild): StringTracker;
export declare function handelConnector(thisPage: any, connectorArray: any[]): Promise<boolean>;
