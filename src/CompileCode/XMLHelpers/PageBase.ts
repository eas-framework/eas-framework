import StringTracker from "../../EasyDebug/StringTracker";
import { BaseReader } from '../BaseReader/Reader';
import { getDataTages } from "./Extricate";
import { StringNumberMap, SessionInfo } from './CompileTypes';
import { CreateFilePath, ParseDebugLine, AddDebugInfo } from './CodeInfoAndDebug';
import EasyFs from '../../OutputInput/EasyFs';
import path from 'path';
import { BasicSettings, getTypes } from "../../RunTimeBuild/SearchFileSystem";
import JSParser from "../JSParser";
import { PrintIfNew } from "../../OutputInput/PrintNew";

export default class ParseBasePage {
    public clearData: StringTracker
    public scriptFile = new StringTracker();

    private valueArray: { key: string, value: StringTracker }[] = []
    constructor(code: StringTracker, private sessionInfo: SessionInfo, private loadFromSession = false) {
        this.parseBase(code);
    }

    async loadSettings(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string){
        await this.loadCodeFile(pagePath, isTs, dependenceObject, pageName);
        this.loadDefine();
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

    private async loadCodeFile(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string) {
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

        const SmallPath = path.relative(BasicSettings.fullWebSitePath, haveCode);

        const fileState = await EasyFs.stat(haveCode, 'mtimeMs', true, null); // check page changed date, for dependenceObject
        if (fileState != null) {
            dependenceObject[SmallPath] = fileState;

            const baseModelData = await AddDebugInfo(pageName + ' -> ' + SmallPath, haveCode); // read model
            const modelData = <StringTracker>JSParser.fixText(baseModelData.allData);
            modelData.AddTextBefore('<%');
            modelData.AddTextAfter('%>');

            modelData.AddTextBefore(baseModelData.stringInfo);

            this.scriptFile = modelData;
        } else {
            PrintIfNew({
                id: SmallPath,
                type: 'error',
                errorName: 'codeFileNotFound',
                text: 'Code file not found: ' + SmallPath
            });

            this.scriptFile = new StringTracker(pageName, `<%='<p style="color:red;text-align:left;font-size:16px;">Code File Not Found: ${SmallPath}</p>'%>`);
        }
    }

    private loadSetting(name = 'define', limitArguments = 2) {
        const have = this.clearData.indexOf(`@${name}(`);
        if (have == -1) return false;

        const argumentArray: StringTracker[] = [];

        const before = this.clearData.substring(0, have);
        let workData = this.clearData.substring(have + 8).trimStart();

        for(let i = 0; i < limitArguments; i++) { // arguments reader loop
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

        workData = workData.substring(workData.indexOf(')')+1);
        this.clearData = before.trimEnd().Plus(workData.trimStart());

        return argumentArray;
    }

    private loadDefine(){
        let lastValue = this.loadSetting();

        const values: StringTracker[][] = [];
        while(lastValue){
            values.unshift(lastValue);
            lastValue = this.loadSetting();
        }

        for(const [name, value] of values){
            const nameText = name.eq;
            if(!this.loadFromSession && !this.sessionInfo.defineArray.find(x => x.name == nameText))
                this.sessionInfo.defineArray.push({ name: nameText, value});
            this.clearData = this.clearData.replace(`:${nameText}:`, value);
        }

        if(!this.loadFromSession) return;

        for(const {name, value} of this.sessionInfo.defineArray){
            this.clearData = this.clearData.replace(`:${name}:`, value);
        }
    }
}
const stringAttributes = ['\'', '"', '`'];
