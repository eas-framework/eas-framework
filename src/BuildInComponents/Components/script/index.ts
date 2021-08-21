import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import scriptWithServer from './server';
import scriptWithClient from './client';
import { SessionInfo } from '../../../CompileCode/XMLHelpers/CompileTypes';


export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionInfo): Promise<BuildInComponent> {

    const language = dataTag.remove('lang') || 'js';

    if(dataTag.remove('server')){
        return scriptWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }

    return scriptWithClient(language, dataTag, BetweenTagData, pathName, InsertComponent, sessionInfo);
}