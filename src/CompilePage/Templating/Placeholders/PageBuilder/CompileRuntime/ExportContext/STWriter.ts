import {COMPILE_PARAMS} from "./index.js";
import DataWriter from "../../../../../../RuntimeUtils/DataWriter.js";
import StringTracker from "../../../../../../SourceTracker/StringTracker/StringTracker.js";
import EJSParser from "../../../../EJSParser.js";

export function compileRuntimeScriptBuilder(parser: EJSParser) {
    const scripts = parser.values.filter(x => x.type != 'text').map(x => x.text);

    const build = new StringTracker();

    let counter = 0;
    for (const i of scripts) {
        build.addTextAfter(`\n;__addStringTrackerByIndex(${counter++});`);
        build.plus(i);
    }

    if (parser.values.at(-1)?.type === 'text') {
        build.addTextAfter(`\n;__addStringTrackerByIndex(${counter});`);
    }

    return build;
}

export function compileRuntimeTemplateScript(script: string) {
    return `module.exports = async (${COMPILE_PARAMS.join(',')}) => {var {write, writeSafe, echo, __addStringTrackerByIndex} = createDateWriter();${
        script
    }}`;
}

class DataWriterWithSTIndex extends DataWriter {
    constructor(writeFunc: (text: string, override?: boolean) => void, public __addStringTrackerByIndex: (index: number) => void) {
        super(writeFunc);
    }
}

export default class STWriter {
    private texts: StringTracker[];
    public buildST = new StringTracker();

    constructor(parser: EJSParser) {
        this.texts = parser.values.filter(x => x.type == 'text').map(x => x.text);
        this.writeHook = this.writeHook.bind(this);
        this.addStringTrackerByIndex = this.addStringTrackerByIndex.bind(this);
    }

    private writeHook(data: string, override?: boolean) {
        if (override) {
            this.buildST.getChars().length = 0;
        }

        this.buildST.addTextAfter(data);
    }

    private addStringTrackerByIndex(index: number) {
        this.buildST.plus(this.texts[index]);
    }

    writer() {
        return new DataWriterWithSTIndex(this.writeHook, this.addStringTrackerByIndex);
    }
}
