import StringTracker from '../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent, BuildScriptWithoutModule, StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import client from './Components/client';
import script from './Components/script/index';
import style from './Components/style/index';
import page from './Components/page';
import isolate from './Components/isolate';
import head, {addFinalizeBuild as addFinalizeBuildHead} from './Components/head';
import connect, { addFinalizeBuild as addFinalizeBuildConnect, handelConnector as handelConnectorConnect } from './Components/connect';
import form, { addFinalizeBuild as addFinalizeBuildForm, handelConnector as handelConnectorForm } from './Components/form';

const AllBuildIn = ["client", "script", "style", "page", "connect", "isolate", "form", "head"];

export function StartCompiling(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    let reData: Promise<BuildInComponent>;

    switch (type.eq) {
        case "client":
            reData = client(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "script":
            reData = script(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
            break;
        case "style":
            reData = style(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
            break;
        case "page":
            reData = page(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
            break;
        case "connect":
            reData = connect(type, dataTag, BetweenTagData, isDebug, InsertComponent, sessionInfo);
            break;
        case "form":
            reData = form(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "isolate":
            reData = isolate(BetweenTagData);
            break;
        case "head":
            reData = head(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
    }

    return reData;
}

export function IsInclude(tagname: string) {
    return AllBuildIn.includes(tagname.toLowerCase());
}

export async function finalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap, fullCompilePath:string) {
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