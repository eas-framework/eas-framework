import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import { pathToFileURL } from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { BasicSettings, getTypes } from '../../../RunTimeBuild/SearchFileSystem';
import { SessionBuild } from '../../../CompileCode/Session';
import { parseTagDataStringBoolean } from '../serv-connect/index';
import SourceMapStore from '../../../EasyDebug/SourceMapStore';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionBuild): Promise<BuildInComponent> {

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
            style: (['scss', 'sass'].includes(language) ? InsertComponent.SomePlugins("MinAll", "MinSass") : InsertComponent.SomePlugins("MinCss", "MinAll")) ? 'compressed' : 'expanded',
            importer: {
                findFileUrl: importSass
            },
            logger: sass.Logger.silent,
            url: pathToFileURL(BasicSettings.fullWebSitePath + BetweenTagData.extractInfo())
        });
        outStyle = result?.css ?? outStyle;
    } catch (expression) {
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