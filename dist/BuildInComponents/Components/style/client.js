import StringTracker from '../../../EasyDebug/StringTracker.js';
import { parseTagDataStringBoolean } from '../serv-connect/index.js';
import SourceMapStore from '../../../EasyDebug/SourceMapStore.js';
import { compileSass } from './sass.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const outStyleAsTrim = BetweenTagData.eq.trim();
    if (sessionInfo.cache.style.includes(outStyleAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache.style.push(outStyleAsTrim);
    const { result, outStyle } = await compileSass(language, BetweenTagData, dependenceObject, InsertComponent, isDebug);
    const pushStyle = sessionInfo.addScriptStyle('style', parseTagDataStringBoolean(dataTag, 'page') ? LastSmallPath : BetweenTagData.extractInfo());
    if (result?.sourceMap)
        pushStyle.addSourceMapWithStringTracker(SourceMapStore.fixURLSourceMap(result.sourceMap), BetweenTagData, outStyle);
    else
        pushStyle.addStringTracker(BetweenTagData, { text: outStyle });
    return {
        compiledString: new StringTracker()
    };
}
//# sourceMappingURL=client.js.map