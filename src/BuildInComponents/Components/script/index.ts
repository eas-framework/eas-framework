import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import scriptWithServer from './server';
import scriptWithClient from './client';
import { BuildScriptWithoutModule } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../../CompileCode/Session';


export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, buildScript: BuildScriptWithoutModule, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    if (dataTag.have('src'))
        return {
            compiledString: new StringTracker(type.DefaultInfoText).Plus$`<script${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${BetweenTagData}</script>`
        }

    const language = dataTag.remove('lang') || 'js';

    if (dataTag.have('server')) {
        dataTag.remove('server');
        return scriptWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }

    return scriptWithClient(language, dataTag, LastSmallPath, BetweenTagData, pathName, InsertComponent, sessionInfo);
}