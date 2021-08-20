import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import scriptWithServer from './server';
import scriptWithClient from './client';
import { StringAnyMap } from '../../../CompileCode/XMLHelpers/CompileTypes';


export default function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    const {have, pop} = InsertComponent.parseDataTagFunc(dataTag);

    const language = pop('lang') || 'js';

    if(have('server')){
        pop('server');
        return scriptWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }

    return scriptWithClient(language, BetweenTagData, pathName, InsertComponent, sessionInfo);
}