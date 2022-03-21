
import workerPool from 'workerpool';
import { cpus } from 'os';
import { SystemData } from '../../RunTimeBuild/SearchFileSystem';

interface SplitText {
    text: string,
    type_name: string,
    is_skip: boolean
}

const cpuLength = Math.max(1, Math.floor(cpus().length / 2));
const parse_stream = workerPool.pool(SystemData + '/../static/wasm/reader/worker.js', { maxWorkers: cpuLength });

export async function ParseTextStream(text: string): Promise<SplitText[]> {
    return JSON.parse(await parse_stream.exec('build_stream', [text]));
}

abstract class BaseEntityCode {
    ReplaceAll(text: string, find: string, replace: string) {
        let newText = "";
        for (const i of text.split(find)) {
            newText += replace + i;
        }

        return newText.substring(replace.length);
    }
}


abstract class ReBuildCodeBasic extends BaseEntityCode {
    public ParseArray: SplitText[];

    constructor(ParseArray: SplitText[]) {
        super();
        this.ParseArray = ParseArray;
    }

    BuildCode() {
        let OutString = "";

        for (const i of this.ParseArray) {
            OutString += i.text;
        }

        return this.ReplaceAll(OutString, '<|-|>', '<||>');
    }
}


type DataCodeInfo = {
    text: string,
    inputs: string[]
}

export class ReBuildCodeString extends ReBuildCodeBasic {
    private DataCode: DataCodeInfo;

    constructor(ParseArray: SplitText[]) {
        super(ParseArray);
        this.DataCode = { text: "", inputs: [] };
        this.CreateDataCode();
    }

    get CodeBuildText() {
        return this.DataCode.text;
    }

    set CodeBuildText(value) {
        this.DataCode.text = value;
    }

    get AllInputs() {
        return this.DataCode.inputs;
    }

    private CreateDataCode() {
        for (const i of this.ParseArray) {
            if (i.is_skip) {
                this.DataCode.text += `<|${this.DataCode.inputs.length}|${i.type_name ?? ''}|>`;
                this.DataCode.inputs.push(i.text);
            } else {
                this.DataCode.text += i.text;
            }
        }
    }

    /**
     * if the <||> start with a (+.) like that for example, "+.<||>", the update function will get the last "SkipText" instead getting the new one
     * same with a (-.) just for ignoring current value
     * @returns the builded code
     */
    BuildCode() {
        const newString = this.DataCode.text.replace(/<\|([0-9]+)\|[\w]*\|>/gi, (_, g1) => {
            return this.DataCode.inputs[g1];
        });

        return super.ReplaceAll(newString, '<|-|>', '<||>');
    }
}
