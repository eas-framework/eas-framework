import workerPool from 'workerpool';
import { getDirname } from '../../RunTimeBuild/SearchFileSystem.js';
import { cpus } from 'os';
const cpuLength = Math.max(1, Math.floor(cpus().length / 2));
const parse_stream = workerPool.pool(getDirname(import.meta.url) + '/RustBind/worker.js', { maxWorkers: cpuLength });
export async function ParseTextStream(text) {
    return JSON.parse(await parse_stream.exec('build_stream', [text]));
}
class BaseEntityCode {
    ReplaceAll(text, find, replace) {
        let newText = "";
        for (const i of text.split(find)) {
            newText += replace + i;
        }
        return newText.substring(replace.length);
    }
}
class ReBuildCodeBasic extends BaseEntityCode {
    constructor(ParseArray) {
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
export class ReBuildCodeString extends ReBuildCodeBasic {
    constructor(ParseArray) {
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
    CreateDataCode() {
        for (const i of this.ParseArray) {
            if (i.is_skip) {
                this.DataCode.text += `<|${i.type_name ?? ''}|>`;
                this.DataCode.inputs.push(i.text);
            }
            else {
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
        let counter = -1;
        let newString = "";
        for (let value of this.DataCode.text.split(/<\|[\w]*\|>/)) {
            let AddString = "", IsDefault = false;
            switch (value.substring(value.length - 2)) {
                case '+.':
                    AddString = this.DataCode.inputs[counter];
                    break;
                case '-.':
                    ++counter;
                    break;
                default:
                    AddString = this.DataCode.inputs[++counter];
                    IsDefault = true;
                    break;
            }
            if (!IsDefault) {
                value = value.substring(0, value.length - 2);
            }
            newString += value + (AddString ?? '');
        }
        return super.ReplaceAll(newString, '<|-|>', '<||>');
    }
}
//# sourceMappingURL=EasyScript.js.map