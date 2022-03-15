import path from 'path';
import { BasicSettings, workingDirectory, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import JSParser from './../JSParser';
import StringTracker from '../../EasyDebug/StringTracker';
import { BuildScriptWithoutModule } from './CompileTypes';
import EasyFs from '../../OutputInput/EasyFs';

async function ParseTextCode(code:StringTracker, path:string) {
    const parser = new JSParser(code, path, '<#{debug}', '{debug}#>', 'debug info');
    await parser.findScripts();

    const newCodeString = new StringTracker(code.DefaultInfoText);
    for (const i of parser.values) {
        if (i.type == 'text') {
            newCodeString.Plus(i.text);
        } else {
            newCodeString.Plus$ `<%{?debug_file?}${i.text}%>`;
        }
    }

    return newCodeString;
}

async function ParseScriptCode(code:StringTracker, path:string) {
    const parser = new JSParser(code, path, '<#{debug}', '{debug}#>', 'debug info');
    await parser.findScripts();


    const newCodeString = new StringTracker(code.DefaultInfoText);
    for (const i of parser.values) {
        if (i.type == 'text') {
            newCodeString.Plus(i.text);
        } else {
            newCodeString.Plus$ `run_script_name=\`${JSParser.fixText(i.text)}\`;`;
        }
    }
    return newCodeString;
}

async function ParseDebugLine(code:StringTracker, path:string) {
    const parser = new JSParser(code, path);
    await parser.findScripts();

    for (const i of parser.values) {
        if (i.type == 'text') {
            i.text = await ParseTextCode(i.text, path);
        } else {
            i.text = await ParseScriptCode(i.text, path);
        }
    }

    parser.start = "<%";
    parser.end = "%>";
    return parser.ReBuildText();
}

async function NoTrackStringCode(code:StringTracker, path: string, isDebug: boolean, buildScript: BuildScriptWithoutModule) {
    code = await ParseScriptCode(code, path);
    code = await JSParser.RunAndExport(code, path, isDebug);

    const NewCode = await buildScript(code);
   
    const newCodeStringTracker = JSParser.RestoreTrack(NewCode, code.DefaultInfoText);

    newCodeStringTracker.AddTextBeforeNoTrack('<%!{');
    newCodeStringTracker.AddTextAfterNoTrack('}%>');

    return newCodeStringTracker;
}

export async function AddDebugInfo(pageName:string, FullPath:string, SmallPath:string, cache: {value?: string} = {}){
    if(!cache.value)
        cache.value = await EasyFs.readFile(FullPath, 'utf8');

    return {
        allData: new StringTracker(`${pageName}<line>${SmallPath}`, cache.value),
        stringInfo: `<%run_script_name=\`${JSParser.fixText(pageName)}\`;%>`
    }
}

export function CreateFilePathOnePath(filePath: string, inputPath: string, folder:string, pageType:string, pathType = 0) {
    if (pageType && !inputPath.endsWith('.' + pageType)) {
        inputPath = `${inputPath}.${pageType}`;
    }

    if (inputPath[0] == '.') {
        if (inputPath[1] == '/') {
            inputPath = inputPath.substring(2);
        }
        inputPath = `${path.dirname(filePath)}/${inputPath}`;
    } else if (inputPath[0] == '/') {
        inputPath = `${getTypes.Static[pathType]}${inputPath}`;
    } else {
        inputPath = `${pathType == 0 ? workingDirectory + BasicSettings.WebSiteFolder + '/' : ''}${folder}/${inputPath}`;
    }

    return path.normalize(inputPath);
}

export interface PathTypes {
    SmallPathWithoutFolder?: string,
    SmallPath?: string,
    FullPath?: string,
    FullPathCompile?: string
}

function CreateFilePath(filePath:string, smallPath:string, inputPath:string, folder:string, pageType: string): PathTypes {
    return {
        SmallPath: CreateFilePathOnePath(smallPath, inputPath, folder, pageType, 2),
        FullPath: CreateFilePathOnePath(filePath, inputPath, folder, pageType),
    }
}

export {
    ParseDebugLine,
    CreateFilePath,
    NoTrackStringCode
};