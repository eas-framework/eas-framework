import StringTracker from "../../EasyDebug/StringTracker";
import { StringNumberMap } from './CompileTypes';
export default class ParseBasePage {
    clearData: StringTracker;
    scriptFile: StringTracker;
    valueArray: {
        key: string;
        value: StringTracker;
    }[];
    constructor(code?: StringTracker);
    loadSettings(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string, isComponent?: boolean): Promise<void>;
    private parseBase;
    get(name: string): StringTracker;
    pop(name: string): StringTracker;
    popAny(name: string): StringTracker;
    byValue(value: string): string[];
    replaceValue(name: string, value: StringTracker): void;
    private loadCodeFile;
    private loadSetting;
    private loadDefine;
}
