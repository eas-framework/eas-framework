import StringTracker from "../../EasyDebug/StringTracker";
import { StringNumberMap } from '../XMLHelpers/CompileTypes';
import { SessionBuild } from "../Session";
export default class ParseBasePage {
    code?: StringTracker;
    debug?: boolean;
    isTs?: boolean;
    clearData: StringTracker;
    scriptFile: StringTracker;
    valueArray: {
        key: string;
        value: StringTracker;
    }[];
    constructor(code?: StringTracker, debug?: boolean, isTs?: boolean);
    loadSettings(sessionInfo: SessionBuild, pagePath: string, smallPath: string, dependenceObject: StringNumberMap, pageName: string): Promise<void>;
    private parseBase;
    private rebuild;
    static rebuildBaseInheritance(code: StringTracker): StringTracker;
    pop(name: string): StringTracker;
    popAny(name: string): StringTracker;
    byValue(value: string): string[];
    replaceValue(name: string, value: StringTracker): void;
    private loadCodeFile;
    private loadSetting;
    private loadDefine;
}
