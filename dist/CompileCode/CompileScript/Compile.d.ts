import StringTracker from "../../EasyDebug/StringTracker";
import { SessionBuild } from "../Session";
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
    compile(): Promise<StringTracker>;
}
