import client from './Components/client.js';
import script from './Components/script.js';
import style from './Components/style.js';
import page from './Components/page.js';
import connect, { addFinalizeBuild as addFinalizeBuildConnect } from './Components/connect.js';
const AllBuildIn = ["client", "script", "style", "page", "connect"];
export function StartCompiling(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo) {
    let reData;
    switch (type.eq) {
        case "client":
            reData = client(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo);
            break;
        case "script":
            reData = script(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
            break;
        case "style":
            reData = style(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
            break;
        case "page":
            reData = page(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
            break;
        case "connect":
            reData = connect(type, dataTag, BetweenTagData, isDebug, InsertComponent, sessionInfo);
            break;
    }
    return reData;
}
export function IsInclude(tagname) {
    return AllBuildIn.includes(tagname);
}
export function finalizeBuild(pageData, sessionInfo) {
    return addFinalizeBuildConnect(pageData, sessionInfo);
}
//# sourceMappingURL=index.js.map