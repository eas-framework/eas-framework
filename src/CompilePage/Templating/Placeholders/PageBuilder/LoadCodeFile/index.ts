import { INHERIT } from "../utils.js";
import PPath from "../../../../../Settings/PPath.js";
import StringTracker from "../../../../../SourceTracker/StringTracker/StringTracker.js";
import ArrayGetter from "../ArrayGetter.js";
import { PageBuilder } from "../PageBuilder.js";
import { locationConnectorPPath } from "../../../../../ImportSystem/unit.js";
import path from "node:path";
import { GlobalSettings } from "../../../../../Settings/GlobalSettings.js";
import { SystemLog } from "../../../../../Logger/BasicLogger.js";
import { SystemError } from "../../../../../Logger/ErrorLogger.js";
import EasyFS from "../../../../../Util/EasyFS.js";
import ConnectST from "../../TemplateConnector/ConnectST.js";

const CODE_FILE = 'codefile';

function createCodeFile(file: PPath){
    return EasyFS.writeFileAndPath(file.full, '')
}

export default class LoadCodefile {
    private getter: ArrayGetter<true | StringTracker>
    private alreadyLoaded = false

    constructor(private builder: PageBuilder, private source: StringTracker, private sign: string[] = ['', '']) {
        this.getter = new ArrayGetter(builder.base.values)

    }

    private getFilePath() {
        const data = this.getter.popAny(CODE_FILE)

        let file: PPath
        if (data === true || data.eq == INHERIT || data.eq[0] === '.') {
            file = this.source.topSource.clone()
        } else {
            file = locationConnectorPPath(data.eq, this.source.topSource)
        }

        const ext = data != true && path.extname(data.eq) || (GlobalSettings.compile.typescript ? '.ts' : '.js')
        file.nested += ext

        return file
    }

    private makeScriptFile(content: ConnectST){
        content.stContent = content.stContent.replaceAll('@', '@@') // escape razor

        // make script file
        content.stContent.addTextBefore('<%' + this.sign[0])
        content.stContent.addTextAfter(this.sign[1] + '%>')
    }

    public async load() {
        if (this.alreadyLoaded) {
            SystemLog.error('already-loaded-code-file', `Code file can be loaded only once: ${this.source.topCharStack.toString()}`)
            return
        }

        this.alreadyLoaded = true
        const codeFile = this.getFilePath()
        const newTime = await this.builder.session.dependencies.updateDep(codeFile, true)

        if (newTime == null) {
            if (GlobalSettings.development) {
                SystemLog.log('code-file-created', `Auto create "${codeFile.small}" for file "${this.source.topSource.small}"`)
                await createCodeFile(codeFile)
                return
            } else {
                SystemError('code-file-missing',
                    new Error(`Could not find file "${codeFile.small}" imported from "${this.source.topSource.small}"`),
                    true
                )
            }
        }

        const codeFileST = new ConnectST(codeFile, this.source)
        await codeFileST.read()
        this.makeScriptFile(codeFileST)

        codeFileST.addDebugInfo()

        return codeFileST

    }

}