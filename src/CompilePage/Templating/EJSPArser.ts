import StringTracker from "../../SourceTracker/StringTracker/StringTracker";
import { EJSParserRust } from "../ConnectRust/EJS";
import { findEndOfDef, ParseBlocks } from "../ConnectRust/utils";
import { normalizeText } from "./utils";

export const DEBUG_INFO_PREFIX = '{?debug_file?}';

interface JSParserValues {
    type: 'text' | 'script' | 'no-track',
    text: StringTracker
}

export default class EJSParser {
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
        const find = findEndOfDef(eq, [';', '\n', this.end]);
        return find != -1 ? find + 1 : eq.length;
    }

    ScriptWithInfo(text: StringTracker): StringTracker {
        const WithInfo = new StringTracker();

        const allScript = text.split('\n'), length = allScript.length;
        //new line for debug as new line start
        WithInfo.addTextAfter('\n');

        //file name in comment
        let count = 1;
        for (const i of allScript) {

            if (i.eq.trim().length){
                WithInfo.addTextAfter(`//!${i.topCharStack.toString()}\n`)
                WithInfo.plus(i)
            }
  
            if (count != length) {
                WithInfo.addTextAfter('\n');
                count++;
            }
        }

        return WithInfo;
    }

    async findScripts(values?: ParseBlocks) {
        values ??= await EJSParserRust(this.text.eq, this.start, this.end);
        this.values = [];

        for (const i of values) {
            let substring = this.text.slice(i.start, i.end);
            let type = i.name;

            switch (i.name) {
                case "print":
                    substring = new StringTracker().plus$`write(${substring})`;
                    type = 'script';
                    break;
                case "escape":
                    substring = new StringTracker().plus$`writeSafe(${substring})`;
                    type = 'script';
                    break;
                case "debug":
                    substring = new StringTracker().plus$`\nrun_script_name = \`${normalizeText(substring)}\``
                    type = 'no-track';
                    break;
            }

            if (type != 'text' && !substring.endsWith(';')){
                substring.addTextAfter(';')
            }

            this.values.push({
                text: substring,
                type: <any>type
            });
        }
    }

    ReBuildText() {
        const allCode = new StringTracker();
        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    allCode.plus(i.text);
                }
            } else if (i.type == 'no-track') {
                allCode.plus(this.start, '!', i.text, this.end);

            } else {
                allCode.plus(this.start, i.text, this.end);
            }
        }

        return allCode;
    }

    BuildAll(isDebug: boolean) {
        const runScript = new StringTracker();

        if (!this.values.length) {
            return runScript;
        }

        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    runScript.plus$`\nout_run_script.text+=\`${normalizeText(i.text)}\`;`;
                }
            } else {
                if (isDebug && i.type == 'script') {
                    if (!this.forClientSide) {
                        runScript.addTextAfter(
                            `\nrun_script_code=\`${normalizeText(i.text)}\`;`
                        );
                    }
                    runScript.plus(
                        this.ScriptWithInfo(i.text)
                    );
                } else {
                    runScript.plus(i.text);
                }
            }
        }

        return runScript;
    }

    static async RunAndExport(text: StringTracker, path: string, isDebug: boolean, forClientSide?: boolean) {
        const parser = new EJSParser(text, path);
        await parser.findScripts();
        parser.forClientSide = forClientSide;
        return parser.BuildAll(isDebug);
    }
}