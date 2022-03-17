import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { fileURLToPath, pathToFileURL } from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { BasicSettings, getTypes } from '../../../RunTimeBuild/SearchFileSystem';
import { SessionBuild } from '../../../CompileCode/Session';
import { parseTagDataStringBoolean } from '../serv-connect/index';
import SourceMapStore from '../../../EasyDebug/SourceMapStore';
import { compileSass } from './sass';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionBuild): Promise<BuildInComponent> {
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