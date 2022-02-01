import StringTracker from '../../EasyDebug/StringTracker';
import type { tagDataObjectArray, BuildInComponent, SessionInfo } from '../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, isDebug: boolean, { SomePlugins }: {
    SomePlugins: any;
}, sessionInfo: SessionInfo): Promise<BuildInComponent>;
export declare function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionInfo): StringTracker;
export declare function handelConnector(thisPage: any, connectorArray: any[]): Promise<boolean>;
