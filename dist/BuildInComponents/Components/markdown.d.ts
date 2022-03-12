import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, SessionInfo } from '../../CompileCode/XMLHelpers/CompileTypes';
export default function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: any, session: SessionInfo, dependenceObject: StringNumberMap): Promise<BuildInComponent>;
export declare function minifyMarkdownTheme(): Promise<void>;
export declare function autoCodeTheme(): Promise<string>;
