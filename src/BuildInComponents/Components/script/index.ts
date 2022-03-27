import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import scriptWithServer from './server';
import scriptWithClient from './client';
import { BuildScriptWithoutModule } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../../CompileCode/Session';
import InsertComponent from '../../../CompileCode/InsertComponent';
import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';


export default async function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    if (dataTag.exists('src'))
        return {
            compiledString: new StringTracker(type.DefaultInfoText).Plus$`<script${dataTag.rebuildSpace()}>${BetweenTagData}</script>`
        }

    const language = dataTag.popAnyDefault('lang', 'js');

    if (dataTag.popBoolean('server')) {
        return scriptWithServer(language, pathName, type, dataTag, BetweenTagData);
    }

    return scriptWithClient(language, dataTag, BetweenTagData, sessionInfo);
}