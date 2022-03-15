import styleWithServer from './server.js';
import styleWithClient from './client.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const language = dataTag.remove('lang') || 'css';
    if (dataTag.have('server')) {
        dataTag.remove('server');
        return styleWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }
    return styleWithClient(language, path, pathName, LastSmallPath, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
}
//# sourceMappingURL=index.js.map