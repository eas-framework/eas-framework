import { GlobalSettings } from "../../../../Settings/GlobalSettings.js";
import PPath from "../../../../Settings/PPath.js";
import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker.js";
import { getLocationSourcePath } from "../../../../SourceTracker/StringTracker/utils.js";
import EasyFS from "../../../../Util/EasyFS.js";
import { DEBUG_INFO_PREFIX } from "../../EJSParser.js";

export default class ConnectST {
    public stContent: StringTracker
    constructor(private codeFile: PPath, private lastSource: StringTracker) {

    }

    async read() {
        const content = await EasyFS.readFile(this.codeFile.full)
        this.stContent = StringTracker.fromST(content, this.codeFile, this.lastSource)
    }

    addDebugInfo() {
        if (GlobalSettings.development) {
            this.stContent.addTextBefore(`<%${DEBUG_INFO_PREFIX + getLocationSourcePath(this.stContent)}%>`)
        }
    }

    isolate() {
        this.stContent.addTextBefore('<%{%>')
        this.stContent.addTextAfter('<%}%>')
    }
}