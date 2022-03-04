import StringTracker from '../EasyDebug/StringTracker.js';
import { BaseReader, EJSParser } from './BaseReader/Reader.js';
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
    async findScripts() {
        const values = await EJSParser(this.text.eq, this.start, this.end);
        this.values = [];
        for (const i of values) {
            let substring = this.text.substring(i.start, i.end);
            let type = i.name;
            switch (i.name) {
                case "print":
                    substring = new StringTracker().Plus$ `write(${substring});`;
                    type = 'script';
                    break;
                case "escape":
                    substring = new StringTracker().Plus$ `writeSafe(${substring});`;
                    type = 'script';
                    break;
                case "debug":
                    substring = new StringTracker().Plus$ `\nrun_script_name = \`${JSParser.fixText(substring)}\`;`;
                    type = 'no-track';
                    break;
            }
            this.values.push({
                text: substring,
                type: type
            });
        }
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
            else if (i.type == 'no-track') {
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
    static async RunAndExport(text, path, isDebug) {
        const parser = new JSParser(text, path);
        await parser.findScripts();
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
        this.buildCode = new ReBuildCodeString(await ParseTextStream(await this.ExtractAndSaveCode(code)));
        this.path = path;
    }
    async ExtractAndSaveCode(code) {
        const extractCode = new JSParser(code, this.path);
        await extractCode.findScripts();
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
    async StartBuild() {
        const extractComments = new JSParser(new StringTracker(null, this.buildCode.CodeBuildText), this.path, '/*', '*/');
        await extractComments.findScripts();
        for (const i of extractComments.values) {
            if (i.type == 'text') {
                i.text = this.ParseOutsideOfComment(i.text);
            }
        }
        this.buildCode.CodeBuildText = extractComments.ReBuildText().eq;
        return this.buildCode.BuildCode();
    }
    RestoreAsCode(Data) {
        return new StringTracker(Data.text.StartInfo).Plus$ `<%${Data.type == 'no-track' ? '!' : ''}${Data.text}%>`;
    }
    RestoreCode(code) {
        return code.replacer(this.replacer, (SplitToReplace) => {
            const index = Number(SplitToReplace[1] ?? SplitToReplace[2]);
            return this.RestoreAsCode(this.savedBuildData[index]);
        });
    }
}
//# sourceMappingURL=JSParser.js.map