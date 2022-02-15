import EasyFs from '../OutputInput/EasyFs.js';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem.js';
import { print } from '../OutputInput/Console.js';
import InsertComponent from './InsertComponent.js';
import { PageTemplate } from './ScriptTemplate.js';
import AddPlugin from '../Plugins/Index.js';
import { CreateFilePath, ParseDebugLine, AddDebugInfo } from './XMLHelpers/CodeInfoAndDebug.js';
import * as extricate from './XMLHelpers/Extricate.js';
import StringTracker from '../EasyDebug/StringTracker.js';
import SourceMapStore from '../EasyDebug/SourceMapStore.js';
import BuildScript from './transform/Script.js';
import { Settings as BuildScriptSettings } from '../BuildInComponents/Settings.js';
import ParseBasePage from './XMLHelpers/PageBase.js';
export const Settings = { AddCompileSyntax: ['Razor'], plugins: [] };
const PluginBuild = new AddPlugin(Settings);
export const Components = new InsertComponent(PluginBuild);
export function GetPlugin(name) {
    return Settings.plugins.find(b => b == name || b?.name == name);
}
export function SomePlugins(...data) {
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
async function outPage(data, scriptFile, pagePath, pageName, LastSmallPath, isDebug, dependenceObject) {
    const baseData = new ParseBasePage(data);
    await baseData.loadSettings(pagePath, LastSmallPath, isTs(), dependenceObject, pageName);
    const modelName = baseData.popAny('model')?.eq;
    if (!modelName)
        return scriptFile.Plus(baseData.scriptFile, baseData.clearData);
    data = baseData.clearData;
    //import model
    const { SmallPath, FullPath } = CreateFilePath(pagePath, LastSmallPath, modelName, 'Models', BasicSettings.pageTypes.model); // find location of the file
    if (!await EasyFs.existsFile(FullPath)) {
        const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;
        print.error(ErrorMessage);
        return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
    }
    dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs'); // check page changed date, for dependenceObject
    const baseModelData = await AddDebugInfo(pageName, FullPath, SmallPath); // read model
    let modelData = ParseBasePage.rebuildBaseInheritance(baseModelData.allData);
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
        }
        else { // Try loading data from page base
            const loadFromBase = baseData.pop(i.tag);
            if (loadFromBase && loadFromBase.eq.toLowerCase() != 'inherit')
                modelBuild.Plus(loadFromBase);
        }
    }
    modelBuild.Plus(modelData);
    return await outPage(modelBuild, scriptFile.Plus(baseData.scriptFile), FullPath, pageName, SmallPath, isDebug, dependenceObject);
}
export async function Insert(data, fullPathCompile, pagePath, typeName, smallPath, isDebug, dependenceObject, debugFromPage, hasSessionInfo) {
    const BuildScriptWithPrams = (code, RemoveToModule = true) => BuildScript(code, isTs(), isDebug, RemoveToModule);
    const debugInPage = isDebug && !GetPlugin("SafeDebug");
    const sessionInfo = hasSessionInfo ??
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
    let DebugString = new StringTracker(smallPath, data);
    DebugString = await outPage(DebugString, new StringTracker(DebugString.DefaultInfoText), pagePath, smallPath, smallPath, isDebug, dependenceObject);
    DebugString = await PluginBuild.BuildPage(DebugString, pagePath, smallPath, sessionInfo);
    DebugString = await Components.Insert(DebugString, pagePath, smallPath, smallPath, isDebug, dependenceObject, BuildScriptWithPrams, sessionInfo); // add components
    DebugString = ParseDebugLine(DebugString, smallPath);
    DebugString = debugFromPage ? PageTemplate.RunAndExport(DebugString, pagePath, isDebug) :
        await PageTemplate.BuildPage(DebugString, pagePath, isDebug, fullPathCompile, sessionInfo);
    let DebugStringAsBuild = await BuildScriptWithPrams(DebugString, debugFromPage);
    if (!debugFromPage) {
        DebugStringAsBuild = PageTemplate.AddAfterBuild(DebugStringAsBuild, isDebug);
    }
    return DebugStringAsBuild;
}
//# sourceMappingURL=InsertModels.js.map