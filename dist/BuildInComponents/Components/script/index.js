import scriptWithServer from './server.js';
import scriptWithClient from './client.js';
export default function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const language = dataTag.remove('lang') || 'js';
    if (dataTag.remove('server')) {
        return scriptWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }
    return scriptWithClient(language, dataTag, BetweenTagData, pathName, InsertComponent, sessionInfo);
}
//# sourceMappingURL=index.js.map