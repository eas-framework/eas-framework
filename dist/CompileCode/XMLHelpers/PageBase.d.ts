import StringTracker from "../../EasyDebug/StringTracker";
import { StringNumberMap } from './CompileTypes';
export default class ParseBasePage {
    clearData: StringTracker;
    scriptFile: StringTracker;
    private valueArray;
    constructor(code: StringTracker);
    parseBase(code: StringTracker): void;
    pop(name: string): StringTracker;
    popAny(name: string): StringTracker;
    loadCodeFile(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string): Promise<void>;
}
