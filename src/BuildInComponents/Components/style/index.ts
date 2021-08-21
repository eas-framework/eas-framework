import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import styleWithServer from './server';
import styleWithClient from './client';
import { SessionInfo } from '../../../CompileCode/XMLHelpers/CompileTypes';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionInfo): Promise<BuildInComponent> {
    const language = dataTag.remove('lang') || 'css';

    if(dataTag.remove('server')){
        return styleWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }

    return styleWithClient(language, path, pathName, LastSmallPath, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
}