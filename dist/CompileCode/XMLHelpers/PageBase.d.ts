import StringTracker from "../../EasyDebug/StringTracker";
import { StringNumberMap } from './CompileTypes';
export default class ParseBasePage {
    clearData: StringTracker;
    scriptFile: StringTracker;
    private valueArray;
    constructor(code: StringTracker);
    loadSettings(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string, isComponent?: boolean): Promise<void>;
    private parseBase;
    pop(name: string): StringTracker;
    popAny(name: string): StringTracker;
    private loadCodeFile;
    private loadSetting;
    private loadDefine;
}
