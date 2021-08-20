import StringTracker, { StringTrackerDataInfo } from '../EasyDebug/StringTracker';
import AddPlugin from '../Plugins/Index';
import { tagDataObject, StringNumberMap, tagDataObjectAsText, CompileInFileFunc, BuildScriptWithoutModule, StringArrayOrObject, StringAnyMap } from './XMLHelpers/CompileTypes';
import { InsertComponentBase } from './BaseReader/Reader';
interface DefaultValues {
    value: StringTracker;
    elements: string[];
}
export default class InsertComponent extends InsertComponentBase {
    dirFolder: string;
    PluginBuild: AddPlugin;
    CompileInFile: CompileInFileFunc;
    RemoveEndType: (text: string) => string;
    MicroPlugins: StringArrayOrObject;
    GetPlugin: (name: string) => any;
    SomePlugins: (...names: string[]) => boolean;
    constructor(PluginBuild: AddPlugin);
    FindSpecialTagByStart(string: string): string[];
    tagData(text: StringTracker, a?: tagDataObject[]): tagDataObject[];
    tagDataAsText(data: tagDataObject): tagDataObjectAsText;
    findIndexSearchTag(query: string, tag: StringTracker): number;
    ReBuildTagData(stringInfo: StringTrackerDataInfo, dataTagSplitter: tagDataObject[]): StringTracker;
    CheckMinHTML(code: StringTracker): StringTracker;
    ReBuildTag(type: StringTracker, dataTag: StringTracker, dataTagSpliced: tagDataObject[], BetweenTagData: StringTracker, SendDataFunc: (text: StringTracker) => Promise<StringTracker>): Promise<StringTracker>;
    exportDefaultValues(fileData: StringTracker, foundSetters?: DefaultValues[]): any;
    addDefaultValues(arrayValues: DefaultValues[], fileData: StringTracker): StringTracker;
    parseComponentProps(tagData: tagDataObject[], component: StringTracker): StringTracker;
    buildTagBasic(fileData: StringTracker, tagData: tagDataObject[], path: string, pathName: string, FullPath: string, SmallPath: string, isDebug: boolean, dependenceObject: StringNumberMap, buildScript: BuildScriptWithoutModule, sessionInfo: StringAnyMap, BetweenTagData?: StringTracker): Promise<StringTracker>;
    parseDataTagFunc(dataTag: tagDataObject[]): {
        have: (name: string) => boolean;
        getValue: (name: string) => string;
        pop: (name: string) => string;
    };
    insertTagData(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: StringTracker, { BetweenTagData, dependenceObject, isDebug, buildScript, sessionInfo }: {
        sessionInfo: StringAnyMap;
        BetweenTagData?: StringTracker;
        buildScript: BuildScriptWithoutModule;
        dependenceObject: StringNumberMap;
        isDebug: boolean;
    }): Promise<StringTracker>;
    private CheckDoubleSpace;
    StartReplace(data: StringTracker, pathName: string, path: string, smallPath: string, isDebug: boolean, dependenceObject: StringNumberMap, buildScript: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<StringTracker>;
    private RemoveUnnecessarySpace;
    Insert(data: StringTracker, path: string, pathName: string, smallPath: string, isDebug: boolean, dependenceObject: StringNumberMap, buildScript: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<StringTracker>;
}
export {};
