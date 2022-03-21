import StringTracker from '../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule } from '../CompileCode/XMLHelpers/CompileTypes';
import client from './Components/client';
import script from './Components/script/index';
import style from './Components/style/index';
import page from './Components/page';
import isolate from './Components/isolate';
import svelte from './Components/svelte';
import markdown from './Components/markdown';
import head, { addFinalizeBuild as addFinalizeBuildHead } from './Components/head';
import connect, { addFinalizeBuild as addFinalizeBuildConnect, handelConnector as handelConnectorConnect } from './Components/connect';
import form, { addFinalizeBuild as addFinalizeBuildForm, handelConnector as handelConnectorForm } from './Components/form';
import { SessionBuild } from '../CompileCode/Session';
import InsertComponent from '../CompileCode/InsertComponent';
import record, { updateRecords, perCompile as perCompileRecord, postCompile as postCompileRecord } from './Components/record';
import search from './Components/search';

export const AllBuildIn = ["client", "script", "style", "page", "connect", "isolate", "form", "head", "svelte", "markdown", "record", "search"];

export function StartCompiling(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    let reData: Promise<BuildInComponent>;

    switch (type.eq.toLowerCase()) {
        case "client":
            reData = client(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "record":
            reData = record(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case "search":
            reData = search(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case "script":
            reData = script(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "style":
            reData = style(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case "page":
            reData = page(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case "connect":
            reData = connect(LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case "form":
            reData = form(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "isolate":
            reData = isolate(BetweenTagData);
            break;
        case "head":
            reData = head(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "svelte":
            reData = svelte(path, LastSmallPath, type, dataTag, sessionInfo);
            break;
        case "markdown":
            reData = markdown(type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        default:
            console.error("Component is not build yet");
    }

    return reData;
}

export function IsInclude(tagname: string) {
    return AllBuildIn.includes(tagname.toLowerCase());
}

export async function finalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild, fullCompilePath: string) {
    updateRecords(sessionInfo);

    pageData = addFinalizeBuildConnect(pageData, sessionInfo);
    pageData = addFinalizeBuildForm(pageData, sessionInfo);
    pageData = pageData.replace(/@ConnectHere(;?)/gi, '').replace(/@ConnectHereForm(;?)/gi, '');

    pageData = await addFinalizeBuildHead(pageData, sessionInfo, fullCompilePath);
    return pageData;
}

export function handelConnectorService(type: string, thisPage: any, connectorArray: any[]) {
    if (type == 'connect')
        return handelConnectorConnect(thisPage, connectorArray);
    else
        return handelConnectorForm(thisPage, connectorArray);
}

export async function perCompile() {
    perCompileRecord()
}

export async function postCompile() {
    postCompileRecord()
}