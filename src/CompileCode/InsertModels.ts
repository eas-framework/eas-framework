import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings, getTypes } from '../RunTimeBuild/SearchFileSystem';
import { print } from '../OutputInput/Console';
import InsertComponent from './InsertComponent';
import { PageTemplate } from './ScriptTemplate';
import AddPlugin from '../Plugins/Syntax';
import { CreateFilePath, ParseDebugLine, AddDebugInfo } from './XMLHelpers/CodeInfoAndDebug';
import * as extricate from './XMLHelpers/Extricate';
import StringTracker from '../EasyDebug/StringTracker';
import { ScriptToEASScriptLastProcesses } from './transform/Script';
import { Settings as BuildScriptSettings } from '../BuildInComponents/Settings';
import ParseBasePage from './CompileScript/PageBase';
import { SessionBuild } from './Session';
import { finalizeBuild } from '../BuildInComponents';

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

async function BundlePageTemplate(data: StringTracker, pagePath: string, pageName: string, LastSmallPath: string, sessionInfo: SessionBuild, dynamicCheck?: boolean): Promise<StringTracker> {

    const baseData = new ParseBasePage(sessionInfo, data, isTs());
    if (!await baseData.loadSettings(pagePath, LastSmallPath, pageName, { dynamicCheck })) { // if page not supposed to compile, for example if page must by dynamic but it is not
        return;
    }

    data = baseData.clearData; // page code with the base page -> #[model=Website...]


    /* virtual data holders */
    sessionInfo.connectSitemapXML(baseData.popAny('sitemap')); // building sitemap xml
    sessionInfo.unshiftRuntimeScript(baseData.scriptFile); // bundling the 'codeFile' script

    /* get model */
    const modelName = baseData.defaultValuePopAny('model', 'website');

    if (!modelName){
        return sessionInfo.runtimeScript.Plus(data) // return the page with the 'codeFile' script bundled
    }

    //import model
    const { SmallPath, FullPath } = CreateFilePath(pagePath, LastSmallPath, modelName, getTypes.Models[2], BasicSettings.pageTypes.model); // find location of the file

    if (!await EasyFs.existsFile(FullPath)) {
        const ErrorMessage = `Error model not found -> ${modelName} at page ${pageName}`;

        print.error(ErrorMessage);
        return new StringTracker(data.DefaultInfoText, PageTemplate.printError(ErrorMessage));
    }

    await sessionInfo.dependence(SmallPath, FullPath); // check page changed date, for dependenceObject

    const baseModelData = await AddDebugInfo(false, pageName, FullPath, SmallPath); // read model
    let modelData = await ParseBasePage.rebuildBaseInheritance(baseModelData.allData);

    sessionInfo.debug && modelData.AddTextBeforeNoTrack(baseModelData.stringInfo);

    pageName += " -> " + SmallPath;

    //Get placeholders
    const allData = extricate.getDataTags(modelData, [''], ':', false, true);

    if (allData.error) {
        print.error("Error within model ->", modelName, "at page: ", pageName);
        return data;
    }

    modelData = allData.data;
    const tagArray = allData.found.map(x => x.tag.substring(1));
    const outData = extricate.getDataTags(data, tagArray, 'content:');

    if (outData.error) {
        print.error("Error With model ->", modelName, "at page: ", pageName);
        return data;
    }

    //Build With placeholders
    const modelBuild = new StringTracker();

    for (const i of allData.found) {
        i.tag = i.tag.substring(1); // removing the ':'
        const holderData = outData.found.find((e) => e.tag == 'content:' + i.tag);

        modelBuild.Plus(modelData.substring(0, i.loc));
        modelData = modelData.substring(i.loc);

        if (holderData) {
            modelBuild.Plus(holderData.data);
        } else { // Try loading data from page base
            const loadFromBase = baseData.get(i.tag);

            if (loadFromBase && loadFromBase !== true && loadFromBase.eq.toLowerCase() != 'inherit')
                modelBuild.Plus(loadFromBase);
        }
    }

    modelBuild.Plus(modelData);
    return await BundlePageTemplate(modelBuild, FullPath, pageName, SmallPath, sessionInfo);
}

export async function Insert(data: string, fullPathCompile: string, nestedPage: boolean, nestedPageData: string, sessionInfo: SessionBuild, dynamicCheck?: boolean) {
    let DebugString = new StringTracker(sessionInfo.smallPath, data);
    DebugString = await BundlePageTemplate(DebugString, sessionInfo.fullPath, sessionInfo.smallPath, sessionInfo.smallPath, sessionInfo, dynamicCheck);

    if (DebugString == null) { // if page not supposed to compile, for example if page must by dynamic but it is not
        return;
    }

    DebugString = await PluginBuild.BuildPage(DebugString, sessionInfo.fullPath, sessionInfo.smallPath, sessionInfo);
    DebugString = await Components.Insert(DebugString, sessionInfo.smallPath, sessionInfo); // add components

    DebugString = await ParseDebugLine(DebugString, sessionInfo.smallPath);

    if (nestedPage) { // return StringTracker, because this import was from page
        return PageTemplate.InPageTemplate(DebugString, nestedPageData, sessionInfo.fullPath);
    }

    DebugString = await finalizeBuild(DebugString, sessionInfo, fullPathCompile);

    DebugString = await PageTemplate.BuildPage(DebugString, sessionInfo);
    DebugString = await ScriptToEASScriptLastProcesses(DebugString, isTs(), sessionInfo);
    DebugString = PageTemplate.AddAfterBuild(DebugString, sessionInfo.debug);

    return DebugString;
}