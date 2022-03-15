import StringTracker from '../../../EasyDebug/StringTracker.js';
import scriptWithServer from './server.js';
import scriptWithClient from './client.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, buildScript, sessionInfo) {
    if (dataTag.have('src'))
        return {
            compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<script${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${BetweenTagData}</script>`
        };
    const language = dataTag.remove('lang') || 'js';
    if (dataTag.have('server')) {
        dataTag.remove('server');
        return scriptWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }
    return scriptWithClient(language, dataTag, LastSmallPath, BetweenTagData, pathName, InsertComponent, sessionInfo);
}
//# sourceMappingURL=index.js.map