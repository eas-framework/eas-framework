import StringTracker, { StringTrackerDataInfo } from '../EasyDebug/StringTracker';
import { BaseReader } from './BaseReader/Reader';
import { ParseTextStream, ReBuildCodeString } from './ScriptReader/EasyScript';
import { SourceMapGenerator } from "source-map-js";
import path from 'path';
import { finalizeBuild } from '../BuildInComponents/index';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';

interface JSParserValues {
    type: 'text' | 'script' | 'none-track-script',
    text: StringTracker
}

export default class JSParser {
    public start: string;
    public text: StringTracker;
    public end: string;
    public type: string;
    public path: string;
    public values: JSParserValues[];

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

            WithInfo.Plus(
                new StringTracker(StringTracker.emptyInfo, `//!${i.lineInfo}\n`),
                i
            )

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

            if (StartIndex == -1) {
                break;
            }

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

                script = script.substring(1, index);
                if (script.endsWith(';')) {
                    script = script.substring(0, script.length - 1);
                }

                if (t == ':') {
                    stringCopy.Plus$`safeWrite(${script});`;
                } else {
                    stringCopy.Plus$`write(${script});`;
                }

                script = new StringTracker(script.StartInfo).Plus$`${stringCopy};${script.substring(index)}`;
            }

            if (t != '#') {
                if (!script.endsWith(';')) {
                    script.Plus(';');
                }

                if (script.startsWith('{?debug_file?}')) {
                    const info = script.substring(14);

                    this.values.push({
                        type: 'script',
                        text: new StringTracker(StringTracker.emptyInfo).Plus$`\nrun_script_name = \`${JSParser.fixText(info)}\`;`
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

    static fixText(text: StringTracker | string) {
        return text.replace(/\\/gi, '\\\\').replace(/`/gi, '\\`').replace(/\$/gi, '\\u0024');
    }

    ReBuildText() {
        const allcode = new StringTracker(this.values[0]?.text?.StartInfo);
        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    allcode.Plus(i.text);
                }
            } else if (i.type == 'none-track-script') {
                allcode.Plus(this.start, '!', i.text, this.end);

            } else {
                allcode.Plus(this.start, i.text, this.end);
            }
        }

        return allcode;
    }

    BuildAll(isDebug: boolean) {
        if (!this.values.length) {
            return;
        }
        const runScript = new StringTracker(this.values[0]?.text?.StartInfo);

        for (const i of this.values) {
            if (i.type == 'text') {
                if (i.text.eq != '') {
                    runScript.Plus$`\nout_run_script.text+=\`${JSParser.fixText(i.text)}\`;`;
                }
            } else {
                if (isDebug && i.type == 'script') {
                    runScript.Plus(
                        new StringTracker(StringTracker.emptyInfo, `\nrun_script_code=\`${JSParser.fixText(i.text)}\`;`),
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
        return `<p style="color:red;text-align:left;font-size:16px;">${message}</p>`;
    }

    static RunAndExport(text: StringTracker, path: string, isDebug: boolean) {
        const parser = new JSParser(text, path)
        parser.findScripts();
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

    static RestoreTrack(text: string, defaultInfo: StringTrackerDataInfo) {
        const tracker = new StringTracker(defaultInfo);

        const allLines = text.split('\n//!');

        tracker.Plus(allLines.shift());

        for (const i of allLines) {
            const infoLine = i.split('\n', 1).pop(), dataText = i.substring(infoLine.length);

            const [infoText, numbers] = JSParser.split2FromEnd(infoLine, ':', 2), [line, char] = numbers.split(':');

            tracker.Plus(new StringTracker(StringTracker.emptyInfo, '\n//!' + infoLine));
            tracker.AddTextAfter(dataText, infoText, Number(line) - 1, Number(char));
        }

        return tracker;
    }
}

export class PageTemplate extends JSParser {

    private static CreateSourceMap(text: StringTracker, filePath: string): string {
        const map = new SourceMapGenerator({
            file: filePath.split(/\/|\\/).pop()
        });

        const thisDirFile = path.dirname(filePath);

        const DataArray = text.getDataArray(), length = DataArray.length;

        let lineCount = 0;
        for (let index = 1, element = DataArray[index]; index < length; index++) {

            if(element.text == '\n'){
                lineCount++;
                continue;
            }

            if(!lineCount){
                continue;
            }

            const {line, info} = element;

            if (line && info) {
                map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: lineCount, column: 0 },
                    source: path.relative(thisDirFile, info.split('<line>').pop().trim()).replace(/\\/gi, '/')
                });
            }
        }

        // const allLines = text.split('\n');


        // for (let index = 1; index < length; index++) {
        //     for (const { StartInfo } of [...allLines[index]]) {
        //         if (StartInfo.line && StartInfo.info) {
        //             map.addMapping({
        //                 original: { line: StartInfo.line, column: 0 },
        //                 generated: { line: index, column: 0 },
        //                 source: path.relative(thisDirFile, StartInfo.info.split('<line>').pop().trim()).replace(/\\/gi, '/')
        //             });
        //         }
        //     }
        // }

        // allLines[index].forEachInfo((text, info, line) => {
        //     if (line && info) {
        //         map.addMapping({
        //             original: { line, column: 0 },
        //             generated: { line: line, column: 0 },
        //             source: path.relative(thisDirFile, info.split('<line>').pop().trim()).replace(/\\/gi, '/')
        //         });
        //     }
        // });
    // }

        // for(const [k, v] of Object.entries(allLines)) {
        //     const line = Number(k);
        //     if (line)
        //         for (const b of [...v]) {
        //         if (b.StartInfo.line && b.StartInfo.info) {
        //                 map.addMapping({
        //                     original: { line: b.StartInfo.line, column: 0 },
        //                     generated: { line: line, column: 0 },
        //                     source: path.relative(thisDirFile, b.StartInfo.info.split('<line>').pop().trim()).replace(/\\/gi, '/')
        //                 });
        //             }
        //         }
        // }
        
        return "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(map.toString()).toString("base64");
    }

    private static AddPageTemplate(text: StringTracker, isDebug: boolean, fullPathCompile: string, sessionInfo: StringAnyMap): StringTracker {
    // text = PageTemplate.AddLineNumbers(text);

    text = finalizeBuild(text, sessionInfo);

    if (isDebug) {
        text.AddTextBefore(`try {\n`);
    }


    text.AddTextBefore(`
        export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, isDebug, RequireVar} = page,
                    
                    run_script_code = run_script_name; 

                {`);



    if (isDebug) {
        text.AddTextAfter(`\n}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\\n( )*at /)[2];
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }`);
    }

    text.AddTextAfter(`}});}`);

    if (isDebug) {
        text.Plus(PageTemplate.CreateSourceMap(text, fullPathCompile));
    }

    return text;
}

    // static AddLineNumbers(code: StringTracker) {
    //     const splitAll = code.split('\n'), length = splitAll.length;
    //     let count = 1;
    //     const newCode = new StringTracker(code.StartInfo);

    //     for (const i of splitAll) {
    //         newCode.Plus(i.replace(/__line_number/gi, '' + count));

    //         if (count != length) {
    //             newCode.Plus('\n');
    //             count++;
    //         }
    //     }

    //     return newCode;
    // }

    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: StringAnyMap) {
    const builtCode = PageTemplate.RunAndExport(text, path, isDebug);

    return PageTemplate.AddPageTemplate(builtCode, isDebug, fullPathCompile, sessionInfo);
}

    static AddAfterBuild(text: string, isDebug: boolean) {
    if (isDebug) {
        text = "import sourceMapSupport from 'source-map-support'; sourceMapSupport.install({hookRequire: true});" + text;
    }
    return text;
}
}

//build special class for parser comments /**/ so you be able to add Razor inside of style ot script tag

interface GlobalReplaceArray {
    type: 'script' | 'none-track-script',
    text: StringTracker
}

export class EnableGlobalReplace {
    private savedBuildData: GlobalReplaceArray[] = [];
    private buildCode: ReBuildCodeString;
    private path: string;
    private replacer: RegExp;

    constructor(private addText = "") {
        this.replacer = new RegExp(`system--<\\|ejs\\|([0-9])\\|>|\\/${addText}\\*!system--<\\|ejs\\|([0-9])\\|>\\*\\/`);
    }

    async load(code: StringTracker, path: string) {
        this.buildCode = new ReBuildCodeString(await ParseTextStream(this.ExtractAndSaveCode(code)));
        this.path = path;
    }

    private ExtractAndSaveCode(code: StringTracker) {
        const extractCode = new JSParser(code, this.path);
        extractCode.findScripts();

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

    public StartBuild() {
        const extractComments = new JSParser(new StringTracker(StringTracker.emptyInfo, this.buildCode.CodeBuildText), this.path, '/*', '*/');
        extractComments.findScripts();

        for (const i of extractComments.values) {
            if (i.type == 'text') {
                i.text = this.ParseOutsideOfComment(i.text);
            }
        }

        this.buildCode.CodeBuildText = extractComments.ReBuildText().eq;
        return this.buildCode.BuildCode();
    }

    private RestoreAsCode(Data: GlobalReplaceArray) {
        return new StringTracker(Data.text.StartInfo).Plus$`<%${Data.type == 'none-track-script' ? '!' : ''}${Data.text}%>`;
    }

    public RestoreCode(code: StringTracker) {
        return code.replacer(this.replacer, (SplitToReplace) => {
            const index = Number(SplitToReplace[1] ?? SplitToReplace[2]);

            return this.RestoreAsCode(this.savedBuildData[index]);
        });
    }
}