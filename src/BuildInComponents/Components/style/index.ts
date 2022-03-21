import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import styleWithServer from './server';
import styleWithClient from './client';
import { SessionBuild } from '../../../CompileCode/Session';
import InsertComponent from '../../../CompileCode/InsertComponent';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const language = dataTag.remove('lang') || 'css';

    if(dataTag.have('server')){
        dataTag.remove('server');
        return styleWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, InsertComponent, sessionInfo);
    }

    return styleWithClient(language, path, pathName, LastSmallPath, dataTag, BetweenTagData, InsertComponent, sessionInfo);
}