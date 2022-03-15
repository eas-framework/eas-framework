import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../CompileCode/Session';
export default function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: any, session: SessionBuild, dependenceObject: StringNumberMap): Promise<BuildInComponent>;
export declare function minifyMarkdownTheme(): Promise<void>;
export declare function autoCodeTheme(): Promise<string>;
