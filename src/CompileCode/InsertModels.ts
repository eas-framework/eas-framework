import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings, getTypes } from '../RunTimeBuild/SearchFileSystem';
import { print } from '../OutputInput/Console';
import InsertComponent from './InsertComponent';
import { PageTemplate } from './ScriptTemplate';
import AddPlugin from '../Plugins/Index';
import { CreateFilePath, ParseDebugLine, AddDebugInfo } from './XMLHelpers/CodeInfoAndDebug';
import * as extricate from './XMLHelpers/Extricate';
import StringTracker from '../EasyDebug/StringTracker';
import SourceMapStore from '../EasyDebug/SourceMapStore';
import { StringNumberMap, SessionInfo } from './XMLHelpers/CompileTypes';
import BuildScript from './transform/Script';
import { Settings as BuildScriptSettings } from '../BuildInComponents/Settings';
import ParseBasePage from './XMLHelpers/PageBase';

export const Settings = { AddCompileSyntax: ['Razor'], plugins: [] };
const PluginBuild = new AddPlugin(Settings);
export const Components = new InsertComponent(PluginBuild);

export function GetPlugin(name: string) {
    return Settings.plugins.find(b => b == name || (<any>b)?.name == name);
}

export function SomePlugins(...data: string[]) {
    return data.some(x => GetPlugin(x));
}

export function isTs() {
    return Settings.AddCompileSyntax.includes('TypeScript');
}

Components.MicroPlugins = Settings.plugins;
Components.GetPlugin = GetPlugin;
Components.SomePlugins = SomePlugins;
Components.isTs = isTs;

BuildScriptSettings.plugins = Settings.plugins;

async function outPage(data: StringTracker, pagePath: string, pageName: string, LastSmallPath: string, isDebug: boolean, dependenceObject: StringNumberMap): Promise<StringTracker> {

    const baseData = new ParseBasePage(data);
    await baseData.loadCodeFile(pagePath, isTs(), dependenceObject, pageName);

    const modelName = baseData.popAny('model')?.eq;

    if (!modelName) return baseData.scriptFile.Plus(baseData.clearData);
    data = baseData.clearData;

    //import model
    const { SmallPath, FullPath } = CreateFilePath(pagePath, LastSmallPath, modelName, 'Models', BasicSettings.pageTypes.model); // find location of the file

    if (!await EasyFs.existsFile(FullPath)) {
        const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;

        print.error(ErrorMessage);
        return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
    }

    dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs'); // check page changed date, for dependenceObject

    const baseModelData = await AddDebugInfo(pageName, FullPath); // read model
    let modelData = baseModelData.allData;

    modelData.AddTextBefore(baseModelData.stringInfo);

    pageName += " -> " + SmallPath;

    //Get placeholders
    const allData = extricate.getDataTages(modelData, [''], ':', false, true);

    if (allData.error) {
        print.error("Error within model ->", modelName, "at page: ", pageName);
        return data;
    }

    modelData = allData.data;
    const tagArray = allData.found.map(x => x.tag.substring(1));
    const outData = extricate.getDataTages(data, tagArray, '@');

    if (outData.error) {
        print.error("Error With model ->", modelName, "at page: ", pageName);
        return data;
    }

    //Build With placeholders
    const modelBuild = new StringTracker();

    for (const i of allData.found) {
        i.tag = i.tag.substring(1); // removing the ':'
        const holderData = outData.found.find((e) => e.tag == '@' + i.tag);

        modelBuild.Plus(modelData.substring(0, i.loc));
        modelData = modelData.substring(i.loc);

        if (holderData) {
            modelBuild.Plus(holderData.data);
        } else { // Try loading data from page base
            const loadFromBase = baseData.pop(i.tag);

            if (loadFromBase)
                if (loadFromBase.eq.toLowerCase() == 'inherit') // Save the placeholder for next model
                    modelBuild.Plus(`<:${i.tag}/>`);
                else
                    modelBuild.Plus(loadFromBase);
        }
    }

    modelBuild.Plus(modelData);

    return await outPage(baseData.scriptFile.Plus(modelBuild), FullPath, pageName, SmallPath, isDebug, dependenceObject);
}

export async function Insert(data: string, fullPathCompile: string, pagePath: string, typeName: string, smallPath: string, isDebug: boolean, dependenceObject: StringNumberMap, debugFromPage: boolean, hasSessionInfo?: SessionInfo) {
    const BuildScriptWithPrams = (code: StringTracker, pathName: string, RemoveToModule = true): Promise<string> => BuildScript(code, pathName, isTs(), isDebug, RemoveToModule);

    const debugInPage = isDebug && !GetPlugin("SafeDebug");
    const sessionInfo: SessionInfo = hasSessionInfo ??
    {
        connectorArray: [], scriptURLSet: [], styleURLSet: [],
        style: new SourceMapStore(smallPath, debugInPage, true),
        script: new SourceMapStore(smallPath, debugInPage, false),
        scriptModule: new SourceMapStore(smallPath, debugInPage, false),
        headHTML: '',
        typeName,
        cache: {
            style: [],
            script: [],
            scriptModule: []
        },
        cacheComponent: {}
    };

    let DebugString = new StringTracker(pagePath, data);

    DebugString = await outPage(DebugString, pagePath, smallPath, smallPath, isDebug, dependenceObject);

    DebugString = await PluginBuild.BuildPage(DebugString, pagePath, smallPath, sessionInfo);

    DebugString = await Components.Insert(DebugString, pagePath, smallPath, smallPath, isDebug, dependenceObject, BuildScriptWithPrams, sessionInfo); // add components

    DebugString = ParseDebugLine(DebugString, smallPath);

    DebugString = debugFromPage ? PageTemplate.RunAndExport(DebugString, pagePath, isDebug) :
        await PageTemplate.BuildPage(DebugString, pagePath, isDebug, fullPathCompile, sessionInfo);

    let DebugStringAsBuild = await BuildScriptWithPrams(DebugString, `${smallPath} -><line>${pagePath}`, debugFromPage);

    if (!debugFromPage) {
        DebugStringAsBuild = PageTemplate.AddAfterBuild(DebugStringAsBuild, isDebug);
    }

    return DebugStringAsBuild;
}