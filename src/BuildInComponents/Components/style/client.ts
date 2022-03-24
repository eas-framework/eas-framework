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
import InsertComponent from '../../../CompileCode/InsertComponent';

export default async function BuildCode(language: string, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const outStyleAsTrim = BetweenTagData.eq.trim();
    if (sessionInfo.cache.style.includes(outStyleAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache.style.push(outStyleAsTrim);

    const { result, outStyle } = await compileSass(language, BetweenTagData, InsertComponent, sessionInfo);

    const pushStyle = sessionInfo.addScriptStylePage('style', dataTag,  BetweenTagData);

    if (result?.sourceMap)
        pushStyle.addSourceMapWithStringTracker(SourceMapStore.fixURLSourceMap(<any>result.sourceMap), BetweenTagData, outStyle);
    else
        pushStyle.addStringTracker(BetweenTagData, { text: outStyle });

    return {
        compiledString: new StringTracker()
    };
}