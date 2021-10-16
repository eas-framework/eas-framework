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
export const Settings = { AddCompileSyntax: ["JTags", "Razor"], plugins: [] };
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
BuildScriptSettings.plugins = Settings.plugins;
async function outPage(data, pagePath, pageName, LastSmallPath, isDebug, dependenceObject) {
    const values = extricate.getDataTages(data, ['model'], '@');
    const model = values.found[0];
    let modelName;
    data = values.data;
    if (model == undefined) {
        return data;
    }
    else {
        modelName = model.data.trim();
    }
    const { SmallPath, FullPath } = CreateFilePath(pagePath, LastSmallPath, modelName.eq, 'Models', BasicSettings.pageTypes.model); // find location of the file
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
    const allData = extricate.getDataTages(modelData, [''], ':', false, true);
    if (allData.error) {
        print.error("Error within model ->", modelName, "at page: ", pageName);
        return data;
    }
    modelData = allData.data;
    const arrayTypes = [];
    for (const i of allData.found) {
        const tag = i.tag.substring(1);
        i.tag = '@' + tag;
        arrayTypes.push(tag);
    }
    const outData = extricate.getDataTages(data, arrayTypes, '@');
    if (outData.error) {
        print.error("Error With model ->", modelName, "at page: ", pageName);
        return data;
    }
    const modelBuild = new StringTracker();
    for (const i of allData.found) {
        const t = i.tag;
        const d = outData.found.find((e) => e.tag == t);
        modelBuild.Plus(modelData.substring(0, i.loc));
        modelData = modelData.substring(i.loc);
        if (d != undefined) {
            modelBuild.Plus(d.data);
        }
    }
    modelBuild.Plus(modelData);
    return await outPage(modelBuild, FullPath, pageName, SmallPath, isDebug, dependenceObject);
}
export async function Insert(data, fullPathCompile, pagePath, typeName, smallPath, isDebug, dependenceObject, debugFromPage, hasSessionInfo) {
    const BuildScriptWithPrams = (code, pathName, RemoveToModule = true) => BuildScript(code, pathName, isTs(), isDebug, RemoveToModule);
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
