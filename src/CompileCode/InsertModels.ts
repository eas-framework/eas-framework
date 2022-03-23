import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';
import { print } from '../OutputInput/Console';
import InsertComponent from './InsertComponent';
import { PageTemplate } from './ScriptTemplate';
import AddPlugin from '../Plugins/Index';
import { CreateFilePath, ParseDebugLine, AddDebugInfo } from './XMLHelpers/CodeInfoAndDebug';
import * as extricate from './XMLHelpers/Extricate';
import StringTracker from '../EasyDebug/StringTracker';
import BuildScript from './transform/Script';
import { Settings as BuildScriptSettings } from '../BuildInComponents/Settings';
import ParseBasePage from './CompileScript/PageBase';
import { SessionBuild } from './Session';

export const Settings = { AddCompileSyntax: [], plugins: [], BasicCompilationSyntax: ['Razor'] };
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

async function outPage(data: StringTracker, scriptFile: StringTracker, pagePath: string, pageName: string, LastSmallPath: string, sessionInfo: SessionBuild): Promise<StringTracker> {

    const baseData = new ParseBasePage(data, isTs());
    await baseData.loadSettings(sessionInfo, pagePath, LastSmallPath, pageName);

    const modelName = baseData.popAny('model')?.eq;

    if (!modelName) return scriptFile.Plus(baseData.scriptFile, baseData.clearData);
    data = baseData.clearData;

    //import model
    const { SmallPath, FullPath } = CreateFilePath(pagePath, LastSmallPath, modelName, 'Models', BasicSettings.pageTypes.model); // find location of the file

    if (!await EasyFs.existsFile(FullPath)) {
        const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;

        print.error(ErrorMessage);
        return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
    }

    await sessionInfo.dependence(SmallPath, FullPath); // check page changed date, for dependenceObject

    const baseModelData = await AddDebugInfo(pageName, FullPath, SmallPath); // read model
    let modelData = ParseBasePage.rebuildBaseInheritance(baseModelData.allData);

    modelData.AddTextBeforeNoTrack(baseModelData.stringInfo);

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

            if (loadFromBase && loadFromBase.eq.toLowerCase() != 'inherit')
                modelBuild.Plus(loadFromBase);
        }
    }

    modelBuild.Plus(modelData);

    return await outPage(modelBuild, scriptFile.Plus(baseData.scriptFile), FullPath, pageName, SmallPath, sessionInfo);
}

export async function Insert(data: string, fullPathCompile: string, nestedPage: boolean, nestedPageData: string, sessionInfo: SessionBuild) {
    let DebugString = new StringTracker(sessionInfo.smallPath, data);
    DebugString = await outPage(DebugString, new StringTracker(DebugString.DefaultInfoText), sessionInfo.fullPath, sessionInfo.smallPath, sessionInfo.smallPath, sessionInfo);

    DebugString = await PluginBuild.BuildPage(DebugString, sessionInfo.fullPath, sessionInfo.smallPath, sessionInfo);
    DebugString = await Components.Insert(DebugString, sessionInfo.smallPath, sessionInfo); // add components

    DebugString = await ParseDebugLine(DebugString, sessionInfo.smallPath);

    if (nestedPage) { // return StringTracker, because this import was from page
        return PageTemplate.InPageTemplate(DebugString, nestedPageData, sessionInfo.fullPath);
    }

    DebugString = await PageTemplate.BuildPage(DebugString, fullPathCompile, sessionInfo);
    DebugString = await sessionInfo.BuildScriptWithPrams(DebugString);
    DebugString= PageTemplate.AddAfterBuild(DebugString, sessionInfo.debug);

    return DebugString;
}