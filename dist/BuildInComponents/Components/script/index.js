import scriptWithServer from './server.js';
import scriptWithClient from './client.js';
export default function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const { have, pop } = InsertComponent.parseDataTagFunc(dataTag);
    const language = pop('lang') || 'js';
    if (have('server')) {
        pop('server');
        return scriptWithServer(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent);
    }
    return scriptWithClient(language, BetweenTagData, pathName, InsertComponent, sessionInfo);
}
//# sourceMappingURL=index.js.map