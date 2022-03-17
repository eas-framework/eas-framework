import StringTracker from "../../EasyDebug/StringTracker";
import { SessionBuild } from "../Session";
import { StringAnyMap } from "../XMLHelpers/CompileTypes";
export default class CRunTime {
    script: StringTracker;
    sessionInfo: SessionBuild;
    smallPath: string;
    debug: boolean;
    isTs: boolean;
    define: {};
    constructor(script: StringTracker, sessionInfo: SessionBuild, smallPath: string, debug: boolean, isTs: boolean);
    private templateScript;
    private methods;
    compile(attributes?: StringAnyMap): Promise<StringTracker>;
}
