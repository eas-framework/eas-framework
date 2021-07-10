import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';
import { print } from '../OutputInput/Console';
import InsertComponent from './InsertComponent';
import {PageTemplate} from './JSParser';
import AddPlugin from '../Plugins/Index';
import { CreateFilePath, ParseDebugLine, AddDebugInfo} from './XMLHelpers/CodeInfoAndDebug';
import * as extricate from './XMLHelpers/Extricate';
import StringTracker from '../EasyDebug/StringTracker';
import {StringNumberMap, StringAnyMap} from './XMLHelpers/CompileTypes';
import BuildScript from './transform/Script';
import {Settings as BuildScriptSettings} from '../BuildInComponents/Settings';

export const Settings = {AddCompileSyntax: ["JTags", "Razor"], plugins: []};
const PluginBuild = new AddPlugin(Settings);
export const Components = new InsertComponent(PluginBuild);

export function GetPlugin(name: string) {
    return Settings.plugins.find(b => b == name || (<any>b)?.name == name);
}

export function SomePlugins(...data: string[]) {
    return data.some(x => GetPlugin(x));
}

export function isTs(){
    return  Settings.AddCompileSyntax.includes('TypeScript');
}

Components.MicroPlugins = Settings.plugins;
Components.GetPlugin = GetPlugin;
Components.SomePlugins = SomePlugins;

BuildScriptSettings.plugins = Settings.plugins;

async function outPage(data: StringTracker, pagePath: string, pageName: string, LastSmallPath: string, isDebug: boolean, dependenceObject: StringNumberMap): Promise<StringTracker> {

    const values = extricate.getDataTages(data, ['model'], '@');

    const model = values.found[0];
    let modelName: StringTracker;

    data = values.data;

    if (model == undefined) {
        return data;
    }
    else {
        modelName = model.data.trim();
    }

    const {SmallPath, FullPath} = CreateFilePath(pagePath, LastSmallPath, modelName.eq, 'Models', BasicSettings.pageTypes.model); // find location of the file

    if(!await EasyFs.exists(FullPath)){
        const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;

        print.error(ErrorMessage);
        return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
    }

    dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs'); // check page changed date, for dependenceObject
    
    const baseModelData = await AddDebugInfo(pageName, FullPath); // read model
    let modelData = baseModelData.allData;

    modelData.AddTextBefore(baseModelData.stringInfo);

    pageName += " -> " + SmallPath;

    const allData = extricate.getDataTages(modelData, [''], '?', false, true);

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

export async function Insert(data:string, fullPathCompile:string, pagePath:string, smallPath:string, isDebug:boolean, dependenceObject: StringNumberMap, debugFromPage: boolean, hasSessionInfo?: StringAnyMap) {
    const BuildScriptWithPrams = (code: StringTracker, pathName:string, RemoveToModule = true):Promise<string> => BuildScript(code,pathName, isTs(),isDebug, RemoveToModule);

    const sessionInfo: StringAnyMap = hasSessionInfo ?? {connectorArray: []};

    let DebugString = new StringTracker(pagePath, data);

    DebugString = await outPage(DebugString, pagePath, smallPath, smallPath, isDebug, dependenceObject);

    DebugString = await PluginBuild.BuildPage(DebugString, pagePath, smallPath, sessionInfo);

    DebugString = await Components.Insert(DebugString, pagePath, smallPath, smallPath, isDebug, dependenceObject, BuildScriptWithPrams, sessionInfo); // add components

    DebugString = ParseDebugLine(DebugString, smallPath);

    DebugString = debugFromPage ? PageTemplate.RunAndExport(DebugString, pagePath, isDebug):
    PageTemplate.BuildPage(DebugString, pagePath, isDebug, fullPathCompile, sessionInfo);

    let DebugStringAsBuild = await BuildScriptWithPrams(DebugString, `${smallPath} -><line>${pagePath}`, debugFromPage);

    if(!debugFromPage){
        DebugStringAsBuild = PageTemplate.AddAfterBuild(DebugStringAsBuild, isDebug);
    }

    return DebugStringAsBuild;
}