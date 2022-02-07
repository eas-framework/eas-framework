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
    constructor(code: StringTracker) {
        this.parseBase(code);
    }

    parseBase(code: StringTracker) {
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

        this.clearData = code;
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

    async loadCodeFile(pagePath: string, isTs: boolean, dependenceObject: StringNumberMap, pageName: string) {
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
}
const stringAttributes = ['\'', '"', '`'];
