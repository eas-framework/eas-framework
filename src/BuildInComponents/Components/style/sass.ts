import { fileURLToPath, pathToFileURL } from "url";
import StringTracker from "../../../EasyDebug/StringTracker";
import { BasicSettings, getTypes } from "../../../RunTimeBuild/SearchFileSystem";
import sass from 'sass';
import { PrintIfNew } from "../../../OutputInput/PrintNew";
import { StringNumberMap } from "../../../CompileCode/XMLHelpers/CompileTypes";
import EasyFs from "../../../OutputInput/EasyFs";
import { RawSourceMap } from "source-map-js";


export function createImporter(originalPath: string) {
    return {
        findFileUrl(url: string) {
            if (url[0] == '/' || url[0] == '~') {
                return new URL(
                    url.substring(1),
                    pathToFileURL(url[0] == '/' ? getTypes.Static[0]: getTypes.node_modules[0])
                );
            }

            return new URL(url, pathToFileURL(originalPath));
        }
    }
}


function minifyPluginSass(language: string, SomePlugins: any): boolean {
    return (['scss', 'sass'].includes(language) ? SomePlugins("MinAll", "MinSass") : SomePlugins("MinCss", "MinAll"))
}

export function sassStyle(language: string, SomePlugins: any) {
    return minifyPluginSass(language, SomePlugins) ? 'compressed' : 'expanded';
}

export function sassSyntax(language: 'sass' | 'scss' | 'css'){
    return language == 'sass' ? 'indented': language;
}

export function sassAndSource(sourceMap: RawSourceMap, source: string){
    if(!sourceMap) return;
    for(const i in sourceMap.sources){
        if(sourceMap.sources[i].startsWith('data:')){
            sourceMap.sources[i] = source;
        }
    }
}

export async function compileSass(language: string, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, InsertComponent: any, isDebug: boolean, outStyle = BetweenTagData.eq) {
    const thisPage = BasicSettings.fullWebSitePath + BetweenTagData.extractInfo(),
        thisPageURL = pathToFileURL(thisPage),
        compressed = minifyPluginSass(language, InsertComponent.SomePlugins);

    let result: sass.CompileResult;
    try {
        result = await sass.compileStringAsync(outStyle, {
            sourceMap: isDebug,
            syntax: sassSyntax(<any>language),
            style: compressed ? 'compressed' : 'expanded',
            importer: createImporter(thisPage),
            logger: sass.Logger.silent
        });
        outStyle = result?.css ?? outStyle;
    } catch (expression) {
        PrintIfNew({
            text: BetweenTagData.debugLine(expression),
            errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
            type: expression?.status == 5 ? 'warn' : 'error'
        });
    }

    if (result?.loadedUrls) {
        for (const file of result.loadedUrls) {
            const FullPath = fileURLToPath(<any>file);
            dependenceObject[BasicSettings.relative(FullPath)] = await EasyFs.stat(FullPath, 'mtimeMs');
        }
    }

    sassAndSource(result.sourceMap, thisPageURL.href);
    return { result, outStyle, compressed };
}