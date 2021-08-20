import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import styleWithServer from './server';
import styleWithClient from './client';
import { StringAnyMap } from '../../../CompileCode/XMLHelpers/CompileTypes';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    const {have, pop} = InsertComponent.parseDataTagFunc(dataTag);

    const language = pop('lang') || 'css';

    if(have('server')){
        pop('server');
        return styleWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }

    return styleWithClient(language, path, pathName, LastSmallPath, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
}