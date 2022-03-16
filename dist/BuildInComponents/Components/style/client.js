import StringTracker from '../../../EasyDebug/StringTracker.js';
import sass from 'sass';
import { pathToFileURL } from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew.js';
import EasyFs from '../../../OutputInput/EasyFs.js';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import { BasicSettings, getTypes } from '../../../RunTimeBuild/SearchFileSystem.js';
import { parseTagDataStringBoolean } from '../serv-connect/index.js';
import SourceMapStore from '../../../EasyDebug/SourceMapStore.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    let outStyle = BetweenTagData.eq;
    const outStyleAsTrim = outStyle.trim();
    if (sessionInfo.cache.style.includes(outStyleAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache.style.push(outStyleAsTrim);
    async function importSass(url) {
        const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, url, getTypes.Static[2], InsertComponent.GetPlugin("sass")?.default ?? language);
        if (!await EasyFs.existsFile(FullPath)) {
            PrintIfNew({
                text: `Sass import not found, on file -> ${pathName}:${BetweenTagData.DefaultInfoText.line}`,
                errorName: 'sass-import-not-found',
                type: 'error'
            });
            return;
        }
        dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs');
        return pathToFileURL(FullPath);
    }
    let result;
    try {
        result = await sass.compileStringAsync(outStyle, {
            sourceMap: isDebug,
            syntax: language == 'sass' ? 'indented' : 'scss',
            style: (['scss', 'sass'].includes(language) ? InsertComponent.SomePlugins("MinAll", "MinSass") : InsertComponent.SomePlugins("MinCss", "MinAll")) ? 'compressed' : 'expanded',
            importer: {
                findFileUrl: importSass
            },
            logger: sass.Logger.silent,
            url: pathToFileURL(BasicSettings.fullWebSitePath + BetweenTagData.extractInfo())
        });
        outStyle = result?.css ?? outStyle;
    }
    catch (expression) {
        PrintIfNew({
            text: BetweenTagData.debugLine(expression),
            errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
            type: expression?.status == 5 ? 'warn' : 'error'
        });
    }
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