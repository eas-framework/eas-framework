import StringTracker from '../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent, BuildScriptWithoutModule, StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import client from './Components/client';
import script from './Components/script';
import style from './Components/style';
import page from './Components/page';
import connect, {addFinalizeBuild as addFinalizeBuildConnect} from './Components/connect';

const AllBuildIn = ["client", "script", "style", "page", "connect"];

export function StartCompiling(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    let reData: Promise<BuildInComponent>;

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

export function finalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap) {
    return addFinalizeBuildConnect(pageData, sessionInfo);
}