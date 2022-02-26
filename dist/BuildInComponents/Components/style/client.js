import StringTracker from '../../../EasyDebug/StringTracker.js';
import sass from 'sass';
import { PrintIfNew } from '../../../OutputInput/PrintNew.js';
import EasyFs from '../../../OutputInput/EasyFs.js';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import MinCss from '../../../CompileCode/CssMinimizer.js';
import { getTypes } from '../../../RunTimeBuild/SearchFileSystem.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
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
        return new URL(FullPath);
    }
    let result;
    if (language != 'css') {
        try {
            result = await sass.compileStringAsync(outStyle, {
                sourceMap: isDebug,
                syntax: language == 'sass' ? 'indented' : 'scss',
                importer: {
                    findFileUrl: importSass
                }
            });
        }
        catch (expression) {
            PrintIfNew({
                text: `${expression.message}, on file -> ${pathName}:${BetweenTagData.getLine(expression.line).DefaultInfoText.line}`,
                errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
                type: expression?.status == 5 ? 'warn' : 'error'
            });
        }
    }
    outStyle = result?.css ?? outStyle;
    if (InsertComponent.SomePlugins("MinCss", "MinAll", "MinSass"))
        outStyle = MinCss(outStyle);
    if (result?.sourceMap)
        sessionInfo.style.addSourceMapWithStringTracker(result.sourceMap, BetweenTagData, outStyle);
    else
        sessionInfo.style.addStringTracker(BetweenTagData, { text: outStyle });
    return {
        compiledString: new StringTracker()
    };
}
//# sourceMappingURL=client.js.map