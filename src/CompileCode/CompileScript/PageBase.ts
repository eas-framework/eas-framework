import StringTracker from "../../EasyDebug/StringTracker";
import { BaseReader, pool } from '../BaseReader/Reader';
import { getDataTags } from "../XMLHelpers/Extricate";
import { StringAnyMap, StringNumberMap } from '../XMLHelpers/CompileTypes';
import { AddDebugInfo } from '../XMLHelpers/CodeInfoAndDebug';
import path from 'path';
import { BasicSettings } from "../../RunTimeBuild/SearchFileSystem";
import { createNewPrint } from "../../OutputInput/Logger";
import CRunTime from "./Compile";
import { SessionBuild } from "../Session";
import { print } from "../../OutputInput/Console";
import EasyFs from "../../OutputInput/EasyFs";
import JSParser from "../JSParser";

const ignoreInherit = ['codefile'];
export const settings = { define: {} };

async function PageBaseParser(text: string): Promise<{
    start: number,
    end: number,
    values: {
        start: number,
        end: number,
        key: string,
        char: string
    }[]
}> {
    const parse = await pool.exec('PageBaseParser', [text]);
    return JSON.parse(parse);
}

export default class ParseBasePage {
    public clearData: StringTracker
    public scriptFile = new StringTracker();

    public valueArray: { key: string, value: StringTracker | true, char?: string }[] = []
    constructor(private sessionInfo?: SessionBuild, public code?: StringTracker, public isTs?: boolean) {
    }

    nonDynamic(isDynamic: boolean) {
        if (!isDynamic) return;

        const haveDynamic = this.popAny('dynamic');
        if (haveDynamic != null) return;

        if (this.sessionInfo.debug) {
            const parse = new ParseBasePage();
            parse.clearData = this.clearData;
            parse.valueArray = [...this.valueArray, { key: 'dynamic', value: true }];

            parse.rebuild();

            EasyFs.writeFile(this.sessionInfo.fullPath, parse.clearData.eq);

            const [funcName, printText] = createNewPrint({
                type: 'warn',
                errorName: 'dynamic-ssr-import',
                text: 'Adding \'dynamic\' attribute to file <color>' + this.sessionInfo.smallPath
            })
            print[funcName](printText)
        } 
        
        return true;
    }

    async loadSettings(pagePath: string, smallPath: string, pageName: string, { attributes, dynamicCheck}: { attributes?: StringAnyMap, dynamicCheck?: boolean }) {
        await this.parseBase(this.code);
        if(this.nonDynamic(dynamicCheck)){
            return false;
        }
        
        const run = new CRunTime(this.clearData, this.sessionInfo, smallPath, this.isTs);
        this.clearData = await run.compile(attributes);
        
        await this.loadCodeFile(pagePath, smallPath, this.isTs, pageName);

        this.loadDefine({ ...settings.define, ...run.define });

        return true;
    }

    private async parseBase(code: StringTracker) {
        const parser = await PageBaseParser(code.eq);

        if(parser.start == parser.end){
            this.clearData = code;
            return;
        }

        for(const {char,end,key,start} of parser.values){
            this.valueArray.push({key, value: start === end ? true: code.substring(start, end), char});
        }
        
        this.clearData = code.substring(0, parser.start).Plus(code.substring(parser.end)).trimStart();
    }

    private rebuild() {
        if (!this.valueArray.length) return this.clearData;
        const build = new StringTracker(null, '@[');

        for (const { key, value, char } of this.valueArray) {
            if (value !== true) {
                build.Plus$`${key}=${char}${value}${char} `;
            } else {
                build.Plus$`${key} `;
            }
        }

        this.clearData = build.substring(0, build.length-1).Plus(']\n').Plus(this.clearData);
    }

    static async rebuildBaseInheritance(code: StringTracker) {
        const parse = new ParseBasePage();
        const build = new StringTracker();
        await parse.parseBase(code);

        for (const name of parse.byValue('inherit')) {
            if(ignoreInherit.includes(name.toLowerCase())) continue;
            parse.pop(name)
            build.AddTextAfterNoTrack(`<@${name}><:${name}/></@${name}>`)
        }

        parse.rebuild();

        return parse.clearData.Plus(build);
    }

    get(name: string) {
        return this.valueArray.find(x => x.key === name)?.value
    }

    pop(name: string) {
        return this.valueArray.splice(this.valueArray.findIndex(x => x.key === name), 1)[0]?.value;
    }

    popAny(name: string) {
        const haveName = this.valueArray.findIndex(x => x.key.toLowerCase() == name);

        if (haveName != -1)
            return this.valueArray.splice(haveName, 1)[0].value;

        const asTag = getDataTags(this.clearData, [name], '@');

        if (!asTag.found[0]) return;

        this.clearData = asTag.data;

        return asTag.found[0].data.trim();
    }

    byValue(value: string) {
        return this.valueArray.filter(x => x.value !== true && x.value.eq === value).map(x => x.key)
    }

    replaceValue(name: string, value: StringTracker) {
        const have = this.valueArray.find(x => x.key === name)
        if (have) have.value = value;
    }

    defaultValuePopAny<T>(name: string, defaultValue: T): string | T | null {
        const value = this.popAny(name);
        return value === true ? defaultValue : value?.eq;
    }

    private async loadCodeFile(pagePath: string, pageSmallPath: string, isTs: boolean, pageName: string) {
        let haveCode = this.defaultValuePopAny('codefile', 'inherit');
        if (!haveCode) return;

        const lang = this.defaultValuePopAny('lang', 'js');
        const originalValue = haveCode.toLowerCase();
        if (originalValue == 'inherit')
            haveCode = pagePath;

        const haveExt = path.extname(haveCode).substring(1);

        if (!['js', 'ts'].includes(haveExt)) {
            if (/(\\|\/)$/.test(haveCode))
                haveCode += pagePath.split('/').pop();
            else if (!BasicSettings.pageTypesArray.includes(haveExt))
                haveCode += path.extname(pagePath);
            haveCode += '.' + (lang ? lang : isTs ? 'ts' : 'js');
        }

        if (haveCode[0] == '.')
            haveCode = path.join(path.dirname(pagePath), haveCode)

        const SmallPath = BasicSettings.relative(haveCode);

        if (await this.sessionInfo.dependence(SmallPath, haveCode)) {
            const baseModelData = await AddDebugInfo(false, pageName, haveCode, SmallPath); // read model
            this.scriptFile = baseModelData.allData.replaceAll("@", "@@");
            this.scriptFile = await this.sessionInfo.BuildScriptWithPrams(this.scriptFile) // convert script to EAS Framework script

            this.scriptFile.AddTextBeforeNoTrack('<%');
            this.scriptFile.AddTextAfterNoTrack('%>');
            this.sessionInfo.debug && this.scriptFile.AddTextBeforeNoTrack(baseModelData.stringInfo);

        } else if(originalValue == 'inherit' && this.sessionInfo.debug){
            EasyFs.writeFile(haveCode, '');
            const [funcName, printText] = createNewPrint({
                id: SmallPath,
                type: 'warn',
                errorName: 'create-code-file',
                text: `\nCode file created: <color>${pagePath}<line>${SmallPath}`
            });
            print[funcName](printText);
        }
        else {
            const [funcName, printText] = createNewPrint({
                id: SmallPath,
                type: 'error',
                errorName: 'code-file-not-found',
                text: `\nCode file not found: <color>${pagePath}<line>${SmallPath}`
            });
            print[funcName](printText);

            this.scriptFile = new StringTracker(pageName, JSParser.printError(`Code File Not Found: '${pageSmallPath}' -> '${SmallPath}'`));
        }
    }

    private loadSetting(name = 'define', limitArguments = 2) {
        const have = this.clearData.indexOf(`@${name}(`);
        if (have == -1) return false;

        const argumentArray: StringTracker[] = [];

        const before = this.clearData.substring(0, have);
        let workData = this.clearData.substring(have + 8).trimStart();

        for (let i = 0; i < limitArguments; i++) { // arguments reader loop
            const quotationSign = workData.at(0).eq;

            const endQuote = BaseReader.findEntOfQ(workData.eq.substring(1), quotationSign);

            argumentArray.push(workData.substring(1, endQuote));

            const afterArgument = workData.substring(endQuote + 1).trimStart();
            if (afterArgument.at(0).eq != ',') {
                workData = afterArgument;
                break;
            }

            workData = afterArgument.substring(1).trimStart();
        }

        workData = workData.substring(workData.indexOf(')') + 1);
        this.clearData = before.trimEnd().Plus(workData.trimStart());

        return argumentArray;
    }

    private loadDefine(moreDefine: StringAnyMap) {
        let lastValue = this.loadSetting();

        const values: (StringTracker | string)[][] = [];
        while (lastValue) {
            values.unshift(lastValue);
            lastValue = this.loadSetting();
        }

        values.unshift(...Object.entries(moreDefine))

        for (const [name, value] of values) {
            this.clearData = this.clearData.replaceAll(`:${name}:`, value);
        }
    }
}