import StringTracker from '../EasyDebug/StringTracker';
import { BuildInComponent } from '../CompileCode/XMLHelpers/CompileTypes';
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
import record, { updateRecords, perCompile as perCompileRecord, postCompile as postCompileRecord, deleteBeforeReBuild } from './Components/record';
import search from './Components/search';
import TagDataParser from '../CompileCode/XMLHelpers/TagDataParser';
import extendsAttributes from './Components/extends';
import { frameworkShortName } from '../RunTimeBuild/SearchFileSystem';

const CLIENT = frameworkShortName + '-client', PAGE = frameworkShortName + '-page', ISOLATE = frameworkShortName + '-isolate', SVELTE = frameworkShortName + '-svelte', MARKDOWN = frameworkShortName + '-markdown', CONNECT = frameworkShortName + '-connect', FORM = frameworkShortName + '-form', RECORD = frameworkShortName + '-record', SEARCH = frameworkShortName + '-search', RESULT = frameworkShortName + '-result', EXTENDS = frameworkShortName + '-extends';
export const AllBuildIn = ["script", "style", "head", EXTENDS, RESULT, CLIENT, PAGE, CONNECT, ISOLATE, FORM, SVELTE, MARKDOWN, RECORD, SEARCH];

export function StartCompiling(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    let reData: Promise<BuildInComponent>;

    switch (type.eq.toLowerCase()) {
        case CLIENT:
            reData = client(pathName, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case RECORD:
            reData = record(pathName, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case SEARCH:
            reData = search(pathName, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case PAGE:
            reData = page(pathName, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case CONNECT:
            reData = connect(type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case FORM:
            reData = form(pathName, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case ISOLATE:
            reData = isolate(BetweenTagData);
            break;
        case SVELTE:
            reData = svelte(type, dataTag, sessionInfo);
            break;
        case MARKDOWN:
            reData = markdown(type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case EXTENDS:
        case RESULT:
            reData = extendsAttributes(BetweenTagData, dataTag)
            break;
        case "head":
            reData = head(pathName, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
            break;
        case "script":
            reData = script(pathName, type, dataTag, BetweenTagData, sessionInfo);
            break;
        case "style":
            reData = style(pathName, type, dataTag, BetweenTagData, sessionInfo);
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

export function handelConnectorService(type: string, thisPage: any, connector: any) {
    if (type == 'connect')
        return handelConnectorConnect(thisPage, connector);
    else
        return handelConnectorForm(thisPage, connector);
}

export async function componentPerCompile() {
    perCompileRecord()
}

export async function componentPostCompile() {
    postCompileRecord()
}

export async function componentPerCompilePage(sessionInfo: SessionBuild) {
    sessionInfo.debug && deleteBeforeReBuild(sessionInfo.smallPath);
}

export async function componentPostCompilePage(sessionInfo: SessionBuild) {

}