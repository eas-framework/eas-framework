import StringTracker from "../../EasyDebug/StringTracker";
import { BaseReader } from '../BaseReader/Reader';
import { getDataTages } from "../XMLHelpers/Extricate";
import { StringAnyMap, StringNumberMap } from '../XMLHelpers/CompileTypes';
import { AddDebugInfo } from '../XMLHelpers/CodeInfoAndDebug';
import EasyFs from '../../OutputInput/EasyFs';
import path from 'path';
import { BasicSettings } from "../../RunTimeBuild/SearchFileSystem";
import { PrintIfNew } from "../../OutputInput/PrintNew";
import CRunTime from "./Compile";
import { SessionBuild } from "../Session";

const stringAttributes = ['\'', '"', '`'];
export default class ParseBasePage {
    public clearData: StringTracker
    public scriptFile = new StringTracker();

    public valueArray: { key: string, value: StringTracker }[] = []
    constructor(public code?: StringTracker, public debug?: boolean, public isTs?: boolean) {
    }

    async loadSettings(sessionInfo: SessionBuild, pagePath: string, smallPath: string, dependenceObject: StringNumberMap, pageName: string, attributes?: StringAnyMap) {
        const run = new CRunTime(this.code, sessionInfo, smallPath, this.debug, this.isTs);
        this.code = await run.compile(attributes);

        this.parseBase(this.code);
        await this.loadCodeFile(pagePath, smallPath, this.isTs, dependenceObject, pageName);
        
        this.loadDefine(run.define);
    }

    private parseBase(code: StringTracker) {
        let dataSplit: StringTracker;

        code = code.replacer(/@\[[ ]*(([A-Za-z_][A-Za-z_0-9]*=(("[^"]*")|(`[^`]*`)|('[^']*')|[A-Za-z0-9_]+)([ ]*,?[ ]*)?)*)\]/, data => {
            dataSplit = data[1].trim();
            return new StringTracker();
        });

        while (dataSplit?.length) {
            const findWord = dataSplit.indexOf('=');

            let thisWord = dataSplit.substring(0, findWord).trim().eq;

            if (thisWord[0] == ',')
                thisWord = thisWord.substring(1).trim();

            let nextValue = dataSplit.substring(findWord + 1);

            let thisValue: StringTracker;

            const closeChar = nextValue.at(0).eq;
            if (stringAttributes.includes(closeChar)) {
                const endIndex = BaseReader.findEntOfQ(nextValue.eq.substring(1), closeChar);
                thisValue = nextValue.substring(1, endIndex);

                nextValue = nextValue.substring(endIndex + 1).trim();
            } else {
                const endIndex = nextValue.search(/[_ ,]/);

                if (endIndex == -1) {
                    thisValue = nextValue;
                    nextValue = null;
                }
                else {
                    thisValue = nextValue.substring(0, endIndex);
                    nextValue = nextValue.substring(endIndex).trim();
                }
            }

            dataSplit = nextValue;
            this.valueArray.push({ key: thisWord, value: thisValue });
        }

        this.clearData = code.trimStart();
    }

    private rebuild() {
        if(!this.valueArray.length) return new StringTracker();
        const build = new StringTracker(null, '@[');

        for (const { key, value } of this.valueArray) {
            build.Plus$`${key}="${value.replaceAll('"', '\\"')}"`;
        }
        build.Plus("]").Plus(this.clearData);
        this.clearData = build;
    }

    static rebuildBaseInheritance(code: StringTracker): StringTracker {
        const parse = new ParseBasePage();
        const build = new StringTracker();
        parse.parseBase(code);

        for (const name of parse.byValue('inherit')) {
            parse.pop(name)
            build.Plus(`<@${name}><:${name}/></@${name}>`)
        }

        parse.rebuild();

        return parse.clearData.Plus(build);
    }


    pop(name: string) {
        return this.valueArray.splice(this.valueArray.findIndex(x => x.key === name), 1)[0]?.value;
    }

    popAny(name: string) {
        const haveName = this.valueArray.findIndex(x => x.key.toLowerCase() == name);

        if (haveName != -1)
            return this.valueArray.splice(haveName, 1)[0].value;

        const asTag = getDataTages(this.clearData, [name], '@');

        if (!asTag.found[0]) return;

        this.clearData = asTag.data;

        return asTag.found[0].data.trim();
    }

    byValue(value: string) {
        return this.valueArray.filter(x => x.value.eq === value).map(x => x.key)
    }

    replaceValue(name: string, value: StringTracker) {
        const have = this.valueArray.find(x => x.key === name)
        if (have) have.value = value;
    }

    private async loadCodeFile(pagePath: string, pageSmallPath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string) {
        let haveCode = this.popAny('codefile')?.eq;
        if (!haveCode) return;

        const lang = this.popAny('lang')?.eq;
        if (haveCode.toLowerCase() == 'inherit')
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

        const fileState = await EasyFs.stat(haveCode, 'mtimeMs', true, null); // check page changed date, for dependenceObject
        if (fileState != null) {
            dependenceObject[SmallPath] = fileState;

            const baseModelData = await AddDebugInfo(pageName, haveCode, SmallPath); // read model
            baseModelData.allData.AddTextBeforeNoTrack('<%');
            baseModelData.allData.AddTextAfterNoTrack('%>');

            baseModelData.allData.AddTextBeforeNoTrack(baseModelData.stringInfo);

            this.scriptFile = baseModelData.allData;
        } else {
            PrintIfNew({
                id: SmallPath,
                type: 'error',
                errorName: 'codeFileNotFound',
                text: `\nCode file not found: ${pagePath}<line>${SmallPath}`
            });

            this.scriptFile = new StringTracker(pageName, `<%="<p style=\\"color:red;text-align:left;font-size:16px;\\">Code File Not Found: '${pageSmallPath}' -> '${SmallPath}'</p>"%>`);
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

        const values: (StringTracker|string)[][] = Object.entries(moreDefine);
        while (lastValue) {
            values.unshift(lastValue);
            lastValue = this.loadSetting();
        }

        for (const [name, value] of values) {
            this.clearData = this.clearData.replaceAll(`:${name}:`, value);
        }
    }
}