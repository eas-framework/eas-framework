import { COMPILE_PARAMS } from ".";
import DataWriter from "../../../../../../RuntimeUtils/DataWriter";
import StringTracker from "../../../../../../SourceTracker/StringTracker/StringTracker";
import EJSParser from "../../../../EJSPArser";

export function templateScript(parser: EJSParser) {
    const scripts = parser.values.filter(x => x.type != 'text').map(x => x.text)

    const build = new StringTracker();
    build.addTextAfter(`return async (${COMPILE_PARAMS.join(',')}) => {var {write, writeSafe, echo, __addStringTrackerByIndex} = createDateWriter();`)

    let counter = 0;
    for (const i of scripts) {
        build.addTextAfter(`\n;__addStringTrackerByIndex(${counter++});`)
        build.plus(i)
    }

    build.addTextAfter(`}`)
    return build;
}

class DataWriterWithSTIndex extends DataWriter {
    constructor(writeFunc: (text: string, override?: boolean) => void, public __addStringTrackerByIndex: (index: number) => void){
        super(writeFunc)
    }
}

export default class STWriter {
    private texts: StringTracker[]
    public buildST = new StringTracker()

    constructor(parser: EJSParser){
        this.texts = parser.values.filter(x => x.type == 'text').map(x => x.text)
        this.writeHook = this.writeHook.bind(this)
        this.addStringTrackerByIndex = this.addStringTrackerByIndex.bind(this)
    }

    private writeHook(data: string, override?: boolean){
        if(override){
            this.buildST.getChars().length = 0
        }

        this.buildST.addTextAfter(data)
    }

    private addStringTrackerByIndex(index: number){
        this.buildST.plus(this.texts[index])
    }

    writer(){
        return new DataWriterWithSTIndex(this.writeHook, this.addStringTrackerByIndex)
    }
}
