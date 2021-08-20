import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, isDebug: boolean, { parseDataTagFunc, SomePlugins }: {
    parseDataTagFunc: any;
    SomePlugins: any;
}, sessionInfo: StringAnyMap): Promise<BuildInComponent>;
export declare function addFinalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap): StringTracker;
export declare function handelConnector(thisPage: any, connectorArray: any[]): Promise<boolean>;
