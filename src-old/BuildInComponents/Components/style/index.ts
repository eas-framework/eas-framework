import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import styleWithServer from './server';
import styleWithClient from './client';
import { SessionBuild } from '../../../CompileCode/Session';
import InsertComponent from '../../../CompileCode/InsertComponent';
import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';

export default async function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const language = dataTag.popAnyDefault('lang', 'css');
    BetweenTagData = BetweenTagData?.trim(); // remove spaces

    if(dataTag.popBoolean('server')){
        return styleWithServer(language, pathName, type, dataTag, BetweenTagData, sessionInfo);
    }

    return styleWithClient(language, dataTag, BetweenTagData, sessionInfo);
}