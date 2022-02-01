import StringTracker from '../EasyDebug/StringTracker.js';
import { BaseReader } from './BaseReader/Reader.js';
import { ParseTextStream, ReBuildCodeString } from './ScriptReader/EasyScript.js';
export default class JSParser {
    constructor(text, path, start = "<%", end = "%>", type = 'script') {
        this.start = start;
        this.text = text;
        this.end = end;
        this.type = type;
        this.path = path;
    }
    ReplaceValues(find, replace) {
        this.text = this.text.replaceAll(find, replace);
    }
    findEndOfDefGlobal(text) {
        const eq = text.eq;
        const find = BaseReader.findEndOfDef(eq, [';', '\n', this.end]);
        return find != -1 ? find + 1 : eq.length;
    }
    ScriptWithInfo(text) {
        const WithInfo = new StringTracker(text.StartInfo);
        const allScript = text.split('\n'), length = allScript.length;
        //new line for debug as new line start
        WithInfo.Plus('\n');
        //file name in comment
        let count = 1;
        for (const i of allScript) {
            WithInfo.Plus(new StringTracker(null, `//!${i.lineInfo}\n`), i);
            if (count != length) {
                WithInfo.Plus('\n');
                count++;
            }
        }
        return WithInfo;
    }
    findScripts() {
        this.values = [];
        let text = this.text;
        for (let i = 0; i < this.text.length; i++) {
            const StartIndex = text.indexOf(this.start);
            if (StartIndex == -1)
                break;
            const TextBefore = text.substring(0, StartIndex);
            this.values.push({
                type: 'text',
                text: TextBefore
            });
            text = text.substring(StartIndex + this.start.length);
            const EndIndex = text.indexOf(this.end);
            if (EndIndex == -1) {
                throw new Error(`JSParser, can't find close tag for ${this.type}, at: ${this.path}`);
            }
            let script = text.substring(0, EndIndex).trimEnd();
            const t = script.at(0).eq;
            if (t == '=' || t == ':') {
                const index = this.findEndOfDefGlobal(script);
                const stringCopy = new StringTracker(script.StartInfo);
                const writeScript = script.substring(1, index);
                if (t == ':')
                    stringCopy.Plus$ `safeWrite(${writeScript});`;
                else
                    stringCopy.Plus$ `write(${writeScript});`;
                script = new StringTracker(script.StartInfo).Plus$ `${stringCopy};${script.substring(index + 1)}`;
            }
            if (t != '#') {
                if (script.startsWith('{?debug_file?}')) {
                    const info = script.substring(14);
                    this.values.push({
                        type: 'script',
                        text: new StringTracker(null).Plus$ `\nrun_script_name = \`${JSParser.fixText(info)}\`;`
                    });
                }
                else if (t == '!') {
                    this.values.push({
                        type: 'none-track-script',
                        text: script.substring(1)
                    });
                }
                else {
                    this.values.push({
                        type: 'script',
                        text: script
                    });
                }
            }
            text = text.substring(EndIndex + this.end.length);
        }
        this.values.push({
            type: 'text',
            text
        });
    }
    static fixText(text) {
        return text.replace(/\\/gi, '\\\\').replace(/`/gi, '\\`').replace(/\$/gi, '\\u0024');
    }
    ReBuildText() {
        const allcode = new StringTracker(this.values[0]?.text?.StartInfo);
        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    allcode.Plus(i.text);
                }
            }
            else if (i.type == 'none-track-script') {
                allcode.Plus(this.start, '!', i.text, this.end);
            }
            else {
                allcode.Plus(this.start, i.text, this.end);
            }
        }
        return allcode;
    }
    BuildAll(isDebug) {
        if (!this.values.length) {
            return;
        }
        const runScript = new StringTracker(this.values[0]?.text?.StartInfo);
        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    runScript.Plus$ `\nout_run_script.text+=\`${JSParser.fixText(i.text)}\`;`;
                }
            }
            else {
                if (isDebug && i.type == 'script') {
                    runScript.Plus(new StringTracker(null, `\nrun_script_code=\`${JSParser.fixText(i.text)}\`;`), this.ScriptWithInfo(i.text));
                }
                else {
                    runScript.Plus(i.text);
                }
            }
        }
        return runScript;
    }
    static printError(message) {
        return `<p style="color:red;text-align:left;font-size:16px;">${message}</p>`;
    }
    static RunAndExport(text, path, isDebug) {
        const parser = new JSParser(text, path);
        parser.findScripts();
        return parser.BuildAll(isDebug);
    }
    static split2FromEnd(text, splitChar, numToSplitFromEnd = 1) {
        for (let i = text.length - 1; i >= 0; i--) {
            if (text[i] == splitChar) {
                numToSplitFromEnd--;
            }
            if (numToSplitFromEnd == 0) {
                return [text.substring(0, i), text.substring(i + 1)];
            }
        }
        return [text];
    }
    static RestoreTrack(text, defaultInfo) {
        const tracker = new StringTracker(defaultInfo);
        const allLines = text.split('\n//!');
        tracker.Plus(allLines.shift());
        for (const i of allLines) {
            const infoLine = i.split('\n', 1).pop(), dataText = i.substring(infoLine.length);
            const [infoText, numbers] = JSParser.split2FromEnd(infoLine, ':', 2), [line, char] = numbers.split(':');
            tracker.Plus(new StringTracker(null, '\n//!' + infoLine));
            tracker.AddTextAfter(dataText, infoText, Number(line) - 1, Number(char));
        }
        return tracker;
    }
}
export class EnableGlobalReplace {
    constructor(addText = "") {
        this.addText = addText;
        this.savedBuildData = [];
        this.replacer = RegExp(`${addText}\\/\\*!system--<\\|ejs\\|([0-9])\\|>\\*\\/|system--<\\|ejs\\|([0-9])\\|>`);
    }
    async load(code, path) {
        this.buildCode = new ReBuildCodeString(await ParseTextStream(this.ExtractAndSaveCode(code)));
        this.path = path;
    }
    ExtractAndSaveCode(code) {
        const extractCode = new JSParser(code, this.path);
        extractCode.findScripts();
        let newText = "";
        let counter = 0;
        for (const i of extractCode.values) {
            if (i.type == 'text') {
                newText += i.text;
            }
            else {
                this.savedBuildData.push({
                    type: i.type,
                    text: i.text
                });
                newText += `system--<|ejs|${counter++}|>`;
            }
        }
        return newText;
    }
    ParseOutsideOfComment(text) {
        return text.replacer(/system--<\|ejs\|([0-9])\|>/, (SplitToReplace) => {
            const index = SplitToReplace[1];
            return new StringTracker(index.StartInfo).Plus$ `${this.addText}/*!system--<|ejs|${index}|>*/`;
        });
    }
    StartBuild() {
        const extractComments = new JSParser(new StringTracker(null, this.buildCode.CodeBuildText), this.path, '/*', '*/');
        extractComments.findScripts();
        for (const i of extractComments.values) {
            if (i.type == 'text') {
                i.text = this.ParseOutsideOfComment(i.text);
            }
        }
        this.buildCode.CodeBuildText = extractComments.ReBuildText().eq;
        return this.buildCode.BuildCode();
    }
    RestoreAsCode(Data) {
        return new StringTracker(Data.text.StartInfo).Plus$ `<%${Data.type == 'none-track-script' ? '!' : ''}${Data.text}%>`;
    }
    RestoreCode(code) {
        return code.replacer(this.replacer, (SplitToReplace) => {
            const index = Number(SplitToReplace[1] ?? SplitToReplace[2]);
            return this.RestoreAsCode(this.savedBuildData[index]);
        });
    }
}
//# sourceMappingURL=JSParser.js.map