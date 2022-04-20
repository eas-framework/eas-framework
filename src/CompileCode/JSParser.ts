import StringTracker, { StringTrackerDataInfo } from '../EasyDebug/StringTracker';
import { LogToHTML } from '../OutputInput/Logger';
import { BaseReader, EJSParser } from './BaseReader/Reader';
import { ParseTextStream, ReBuildCodeString } from './transform/EasyScript';

interface JSParserValues {
    type: 'text' | 'script' | 'no-track',
    text: StringTracker
}

export default class JSParser {
    public start: string;
    public text: StringTracker;
    public end: string;
    public type: string;
    public path: string;
    public values: JSParserValues[];
    public forClientSide = false // will render for client side

    constructor(text: StringTracker, path: string, start = "<%", end = "%>", type = 'script') {
        this.start = start;
        this.text = text;
        this.end = end;
        this.type = type;
        this.path = path;
    }

    ReplaceValues(find: string, replace: string) {
        this.text = this.text.replaceAll(find, replace);
    }

    findEndOfDefGlobal(text: StringTracker) {
        const eq = text.eq
        const find = BaseReader.findEndOfDef(eq, [';', '\n', this.end]);
        return find != -1 ? find + 1 : eq.length;
    }

    ScriptWithInfo(text: StringTracker): StringTracker {
        const WithInfo = new StringTracker(text.StartInfo);

        const allScript = text.split('\n'), length = allScript.length;
        //new line for debug as new line start
        WithInfo.Plus('\n');

        //file name in comment
        let count = 1;
        for (const i of allScript) {

            if (i.eq.trim().length)
                WithInfo.Plus(
                    new StringTracker(null, `//!${this.forClientSide ? i.originalLineInfo: i.lineInfo}\n`), //small line info
                    i
                )

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
                    substring = new StringTracker().Plus$`write(${substring})`;
                    type = 'script';
                    break;
                case "escape":
                    substring = new StringTracker().Plus$`writeSafe(${substring})`;
                    type = 'script';
                    break;
                case "debug":
                    substring = new StringTracker().Plus$`\nrun_script_name = \`${JSParser.fixText(substring)}\``
                    type = 'no-track';
                    break;
            }

            if (type != 'text' && !substring.endsWith(';'))
                substring.AddTextAfterNoTrack(';')

            this.values.push({
                text: substring,
                type: <any>type
            });
        }
    }

    static fixText(text: StringTracker | string) {
        return text.replace(/\\/gi, '\\\\').replace(/`/gi, '\\`').replace(/\u0024/gi, '\\u0024');
    }

    static fixTextSimpleQuotes(text: StringTracker | string) {
        return text.replace(/\\/gi, '\\\\').replace(/"/gi, '\\"');
    }

    ReBuildText() {
        const allcode = new StringTracker(this.values[0]?.text?.StartInfo);
        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    allcode.Plus(i.text);
                }
            } else if (i.type == 'no-track') {
                allcode.Plus(this.start, '!', i.text, this.end);

            } else {
                allcode.Plus(this.start, i.text, this.end);
            }
        }

        return allcode;
    }

    BuildAll(isDebug: boolean) {
        const runScript = new StringTracker(this.values[0]?.text?.StartInfo);

        if (!this.values.length) {
            return runScript;
        }

        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    runScript.Plus$`\nout_run_script.text+=\`${JSParser.fixText(i.text)}\`;`;
                }
            } else {
                if (isDebug && i.type == 'script') {
                    if(!this.forClientSide){
                        runScript.Plus(
                            new StringTracker(null, `\nrun_script_code=\`${JSParser.fixText(i.text)}\`;`)
                        );
                    }
                    runScript.Plus(
                        this.ScriptWithInfo(i.text)
                    );
                } else {
                    runScript.Plus(i.text);
                }
            }
        }

        return runScript;
    }

    public static printError(message: string) {
        return `<div style="color:red;text-align:left;font-size:16px;">${JSParser.fixText(LogToHTML(message))}</div>`;
    }

    static async RunAndExport(text: StringTracker, path: string, isDebug: boolean, forClientSide?: boolean) {
        const parser = new JSParser(text, path);
        await parser.findScripts();
        parser.forClientSide = forClientSide;
        return parser.BuildAll(isDebug);
    }

    private static split2FromEnd(text: string, splitChar: string, numToSplitFromEnd = 1) {
        for (let i = text.length - 1; i >= 0; i--) {
            if (text[i] == splitChar) {
                numToSplitFromEnd--;
            }

            if (numToSplitFromEnd == 0) {
                return [text.substring(0, i), text.substring(i + 1)]
            }
        }
        return [text];
    }
}


//build special class for parser comments /**/ so you be able to add Razor inside of style ot script tag

interface GlobalReplaceArray {
    type: 'script' | 'no-track',
    text: StringTracker
}

export class EnableGlobalReplace {
    private savedBuildData: GlobalReplaceArray[] = [];
    private buildCode: ReBuildCodeString;
    private path: string;
    private replacer: RegExp;

    constructor(private addText = "") {
        this.replacer = RegExp(`${addText}\\/\\*!system--<\\|ejs\\|([0-9])\\|>\\*\\/|system--<\\|ejs\\|([0-9])\\|>`);
    }

    async load(code: StringTracker, path: string) {
        this.buildCode = new ReBuildCodeString(await ParseTextStream(await this.ExtractAndSaveCode(code)));
        this.path = path;
    }

    private async ExtractAndSaveCode(code: StringTracker) {
        const extractCode = new JSParser(code, this.path);
        await extractCode.findScripts();

        let newText = "";
        let counter = 0;

        for (const i of extractCode.values) {
            if (i.type == 'text') {
                newText += i.text;
            } else {
                this.savedBuildData.push({
                    type: i.type,
                    text: i.text
                });
                newText += `system--<|ejs|${counter++}|>`;
            }
        }

        return newText;
    }

    private ParseOutsideOfComment(text: StringTracker): StringTracker {
        return text.replacer(/system--<\|ejs\|([0-9])\|>/, (SplitToReplace) => {
            const index = SplitToReplace[1];
            return new StringTracker(index.StartInfo).Plus$`${this.addText}/*!system--<|ejs|${index}|>*/`;
        });
    }

    public async StartBuild() {
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

    private RestoreAsCode(Data: GlobalReplaceArray) {
        return new StringTracker(Data.text.StartInfo).Plus$`<%${Data.type == 'no-track' ? '!' : ''}${Data.text}%>`;
    }

    public RestoreCode(code: StringTracker) {
        return code.replacer(this.replacer, (SplitToReplace) => {
            const index = Number(SplitToReplace[1] ?? SplitToReplace[2]);

            return this.RestoreAsCode(this.savedBuildData[index]);
        });
    }
}