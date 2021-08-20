import styleWithServer from './server.js';
import styleWithClient from './client.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const { have, pop } = InsertComponent.parseDataTagFunc(dataTag);
    const language = pop('lang') || 'css';
    if (have('server')) {
        pop('server');
        return styleWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }
    return styleWithClient(language, path, pathName, LastSmallPath, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo);
}
//# sourceMappingURL=index.js.map