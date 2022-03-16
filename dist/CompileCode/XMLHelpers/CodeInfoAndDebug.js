import path from 'path';
import { BasicSettings, workingDirectory, getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import JSParser from './../JSParser.js';
import StringTracker from '../../EasyDebug/StringTracker.js';
import EasyFs from '../../OutputInput/EasyFs.js';
import { SplitFirst } from '../../StringMethods/Splitting.js';
async function ParseTextCode(code, path) {
    const parser = new JSParser(code, path, '<#{debug}', '{debug}#>', 'debug info');
    await parser.findScripts();
    const newCodeString = new StringTracker(code.DefaultInfoText);
    for (const i of parser.values) {
        if (i.type == 'text') {
            newCodeString.Plus(i.text);
        }
        else {
            newCodeString.Plus$ `<%{?debug_file?}${i.text}%>`;
        }
    }
    return newCodeString;
}
async function ParseScriptCode(code, path) {
    const parser = new JSParser(code, path, '<#{debug}', '{debug}#>', 'debug info');
    await parser.findScripts();
    const newCodeString = new StringTracker(code.DefaultInfoText);
    for (const i of parser.values) {
        if (i.type == 'text') {
            newCodeString.Plus(i.text);
        }
        else {
            newCodeString.Plus$ `run_script_name=\`${JSParser.fixText(i.text)}\`;`;
        }
    }
    return newCodeString;
}
async function ParseDebugLine(code, path) {
    const parser = new JSParser(code, path);
    await parser.findScripts();
    for (const i of parser.values) {
        if (i.type == 'text') {
            i.text = await ParseTextCode(i.text, path);
        }
        else {
            i.text = await ParseScriptCode(i.text, path);
        }
    }
    parser.start = "<%";
    parser.end = "%>";
    return parser.ReBuildText();
}
async function NoTrackStringCode(code, path, isDebug, buildScript) {
    code = await ParseScriptCode(code, path);
    code = await JSParser.RunAndExport(code, path, isDebug);
    const NewCode = await buildScript(code);
    const newCodeStringTracker = JSParser.RestoreTrack(NewCode, code.DefaultInfoText);
    newCodeStringTracker.AddTextBeforeNoTrack('<%!{');
    newCodeStringTracker.AddTextAfterNoTrack('}%>');
    return newCodeStringTracker;
}
export async function AddDebugInfo(pageName, FullPath, SmallPath, cache = {}) {
    if (!cache.value)
        cache.value = await EasyFs.readFile(FullPath, 'utf8');
    return {
        allData: new StringTracker(`${pageName}<line>${SmallPath}`, cache.value),
        stringInfo: `<%run_script_name=\`${JSParser.fixText(pageName)}\`;%>`
    };
}
export function CreateFilePathOnePath(filePath, inputPath, folder, pageType, pathType = 0) {
    if (pageType && !inputPath.endsWith('.' + pageType)) {
        inputPath = `${inputPath}.${pageType}`;
    }
    if (inputPath[0] == '^') { // load from packages
        const [packageName, inPath] = SplitFirst('/', inputPath.substring(1));
        return (pathType == 0 ? workingDirectory : '') + `node_modules/${packageName}/${folder}/${inPath}`;
    }
    if (inputPath[0] == '.') {
        if (inputPath[1] == '/') {
            inputPath = inputPath.substring(2);
        }
        inputPath = `${path.dirname(filePath)}/${inputPath}`;
    }
    else if (inputPath[0] == '/') {
        inputPath = `${getTypes.Static[pathType]}${inputPath}`;
    }
    else {
        inputPath = `${pathType == 0 ? workingDirectory + BasicSettings.WebSiteFolder + '/' : ''}${folder}/${inputPath}`;
    }
    return path.normalize(inputPath);
}
function CreateFilePath(filePath, smallPath, inputPath, folder, pageType) {
    return {
        SmallPath: CreateFilePathOnePath(smallPath, inputPath, folder, pageType, 2),
        FullPath: CreateFilePathOnePath(filePath, inputPath, folder, pageType),
    };
}
export { ParseDebugLine, CreateFilePath, NoTrackStringCode };
//# sourceMappingURL=CodeInfoAndDebug.js.map