import client from './Components/client.js';
import script from './Components/script/index.js';
import style from './Components/style/index.js';
import page from './Components/page.js';
import isolate from './Components/isolate.js';
import svelte from './Components/svelte.js';
import head, { addFinalizeBuild as addFinalizeBuildHead } from './Components/head.js';
import connect, { addFinalizeBuild as addFinalizeBuildConnect, handelConnector as handelConnectorConnect } from './Components/connect.js';
import form, { addFinalizeBuild as addFinalizeBuildForm, handelConnector as handelConnectorForm } from './Components/form.js';
const AllBuildIn = ["client", "script", "style", "page", "connect", "isolate", "form", "head", "svelte"];
export function StartCompiling(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo) {
    let reData;
    switch (type.eq) {
        case "client":
            reData = client(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "script":
            reData = script(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo);
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
        case "svelte":
            reData = svelte(path, LastSmallPath, isDebug, dataTag, dependenceObject, sessionInfo);
            break;
    }
    return reData;
}
export function IsInclude(tagname) {
    return AllBuildIn.includes(tagname.toLowerCase());
}
export async function finalizeBuild(pageData, sessionInfo, fullCompilePath) {
    pageData = addFinalizeBuildConnect(pageData, sessionInfo);
    pageData = addFinalizeBuildForm(pageData, sessionInfo);
    pageData = pageData.replace(/@ConnectHere(;?)/gi, '').replace(/@ConnectHereForm(;?)/gi, '');
    pageData = await addFinalizeBuildHead(pageData, sessionInfo, fullCompilePath);
    return pageData;
}
export function handelConnectorService(type, thisPage, connectorArray) {
    if (type == 'connect')
        return handelConnectorConnect(thisPage, connectorArray);
    else
        return handelConnectorForm(thisPage, connectorArray);
}
//# sourceMappingURL=index.js.map