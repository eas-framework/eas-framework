import StringTracker from "../../EasyDebug/StringTracker.js";
import { BaseReader } from '../BaseReader/Reader.js';
import { getDataTages } from "./Extricate.js";
import { AddDebugInfo } from './CodeInfoAndDebug.js';
import EasyFs from '../../OutputInput/EasyFs.js';
import path from 'path';
import { BasicSettings } from "../../RunTimeBuild/SearchFileSystem.js";
import JSParser from "../JSParser.js";
import { PrintIfNew } from "../../OutputInput/PrintNew.js";
export default class ParseBasePage {
    constructor(code, sessionInfo, loadFromSession = false) {
        this.sessionInfo = sessionInfo;
        this.loadFromSession = loadFromSession;
        this.scriptFile = new StringTracker();
        this.valueArray = [];
        this.parseBase(code);
    }
    async loadSettings(pagePath, isTs, dependenceObject, pageName) {
        await this.loadCodeFile(pagePath, isTs, dependenceObject, pageName);
        this.loadDefine();
    }
    parseBase(code) {
        let dataSplit;
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
            let thisValue;
            const closeChar = nextValue.at(0).eq;
            if (stringAttributes.includes(closeChar)) {
                const endIndex = BaseReader.findEntOfQ(nextValue.eq.substring(1), closeChar);
                thisValue = nextValue.substring(1, endIndex);
                nextValue = nextValue.substring(endIndex + 1).trim();
            }
            else {
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
    pop(name) {
        return this.valueArray.splice(this.valueArray.findIndex(x => x.key === name), 1)[0]?.value;
    }
    popAny(name) {
        const haveName = this.valueArray.findIndex(x => x.key.toLowerCase() == name);
        if (haveName != -1)
            return this.valueArray.splice(haveName, 1)[0].value;
        const asTag = getDataTages(this.clearData, [name], '@');
        if (!asTag.found[0])
            return;
        this.clearData = asTag.data;
        return asTag.found[0].data.trim();
    }
    async loadCodeFile(pagePath, isTs, dependenceObject, pageName) {
        let haveCode = this.popAny('codefile')?.eq;
        if (!haveCode)
            return;
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
            haveCode = path.join(path.dirname(pagePath), haveCode);
        const SmallPath = path.relative(BasicSettings.fullWebSitePath, haveCode);
        const fileState = await EasyFs.stat(haveCode, 'mtimeMs', true, null); // check page changed date, for dependenceObject
        if (fileState != null) {
            dependenceObject[SmallPath] = fileState;
            const baseModelData = await AddDebugInfo(pageName + ' -> ' + SmallPath, haveCode); // read model
            const modelData = JSParser.fixText(baseModelData.allData);
            modelData.AddTextBefore('<%');
            modelData.AddTextAfter('%>');
            modelData.AddTextBefore(baseModelData.stringInfo);
            this.scriptFile = modelData;
        }
        else {
            PrintIfNew({
                id: SmallPath,
                type: 'error',
                errorName: 'codeFileNotFound',
                text: 'Code file not found: ' + SmallPath
            });
            this.scriptFile = new StringTracker(pageName, `<%='<p style="color:red;text-align:left;font-size:16px;">Code File Not Found: ${SmallPath}</p>'%>`);
        }
    }
    loadSetting(name = 'define', limitArguments = 2) {
        const have = this.clearData.indexOf(`@${name}(`);
        if (have == -1)
            return false;
        const argumentArray = [];
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
    loadDefine() {
        let lastValue = this.loadSetting();
        const values = [];
        while (lastValue) {
            values.unshift(lastValue);
            lastValue = this.loadSetting();
        }
        for (const [name, value] of values) {
            const nameText = name.eq;
            if (!this.loadFromSession && !this.sessionInfo.defineArray.find(x => x.name == nameText))
                this.sessionInfo.defineArray.push({ name: nameText, value });
            this.clearData = this.clearData.replace(`:${nameText}:`, value);
        }
        if (!this.loadFromSession)
            return;
        for (const { name, value } of this.sessionInfo.defineArray) {
            this.clearData = this.clearData.replace(`:${name}:`, value);
        }
    }
}
const stringAttributes = ['\'', '"', '`'];
//# sourceMappingURL=PageBase.js.map