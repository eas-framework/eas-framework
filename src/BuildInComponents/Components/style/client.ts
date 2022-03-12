import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import { pathToFileURL } from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { SessionInfo } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { getTypes } from '../../../RunTimeBuild/SearchFileSystem';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionInfo): Promise<BuildInComponent> {

    let outStyle = BetweenTagData.eq;

    const outStyleAsTrim = outStyle.trim();
    if (sessionInfo.cache.style.includes(outStyleAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache.style.push(outStyleAsTrim);


    async function importSass(url: string) {
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

        return pathToFileURL(FullPath)
    }

    let result: sass.CompileResult;


    try {
        result = await sass.compileStringAsync(outStyle, {
            sourceMap: isDebug,
            syntax: language == 'sass' ? 'indented' : 'scss',
            style: ['scss', 'sass'].includes(language) ? InsertComponent.SomePlugins("MinAll", "MinSass") : InsertComponent.SomePlugins("MinCss", "MinAll") ? 'compressed' : 'expanded',
            importer: {
                findFileUrl: importSass
            }
        });
        outStyle = result?.css ?? outStyle;
    } catch (expression) {
        PrintIfNew({
            text: `${expression.message}, on file -> ${pathName}:${BetweenTagData.getLine(expression.line).DefaultInfoText.line}`,
            errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
            type: expression?.status == 5 ? 'warn' : 'error'
        });
    }

    if (result?.sourceMap)
        sessionInfo.style.addSourceMapWithStringTracker(result.sourceMap, BetweenTagData, outStyle);
    else
        sessionInfo.style.addStringTracker(BetweenTagData, { text: outStyle });

    return {
        compiledString: new StringTracker()
    };
}