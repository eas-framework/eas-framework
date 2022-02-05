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
    constructor(code) {
        this.scriptFile = new StringTracker();
        this.valueArray = [];
        this.parseBase(code);
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
        this.clearData = code;
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
        if (haveCode.toLowerCase() == 'inherit')
            haveCode = pagePath;
        const haveExt = path.extname(haveCode).substring(1);
        if (!['js', 'ts'].includes(haveExt)) {
            if (!BasicSettings.pageTypesArray.includes(haveExt))
                haveCode += path.extname(pagePath);
            haveCode += isTs ? '.ts' : '.js';
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
}
const stringAttributes = ['\'', '"', '`'];
//# sourceMappingURL=PageBase.js.map