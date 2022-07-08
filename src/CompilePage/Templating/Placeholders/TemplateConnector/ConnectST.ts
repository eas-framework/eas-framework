import { GlobalSettings } from "../../../../Settings/GlobalSettings";
import PPath from "../../../../Settings/PPath";
import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker";
import { getLocationSourcePath } from "../../../../SourceTracker/StringTracker/utils";
import EasyFS from "../../../../Util/EasyFS";
import { DEBUG_INFO_PREFIX } from "../../EJSParser";

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