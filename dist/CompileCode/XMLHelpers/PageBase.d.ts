import StringTracker from "../../EasyDebug/StringTracker";
import { StringNumberMap, SessionInfo } from './CompileTypes';
export default class ParseBasePage {
    private sessionInfo;
    private loadFromSession;
    clearData: StringTracker;
    scriptFile: StringTracker;
    private valueArray;
    constructor(code: StringTracker, sessionInfo: SessionInfo, loadFromSession?: boolean);
    loadSettings(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string): Promise<void>;
    private parseBase;
    pop(name: string): StringTracker;
    popAny(name: string): StringTracker;
    private loadCodeFile;
    private loadSetting;
    private loadDefine;
}
