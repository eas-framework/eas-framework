import { fileURLToPath, pathToFileURL } from "url";
import StringTracker from "../../../EasyDebug/StringTracker";
import { BasicSettings, getTypes } from "../../../RunTimeBuild/SearchFileSystem";
import sass from 'sass';
import { PrintIfNew } from "../../../OutputInput/PrintNew";
import { StringNumberMap } from "../../../CompileCode/XMLHelpers/CompileTypes";
import EasyFs from "../../../OutputInput/EasyFs";
import { RawSourceMap } from "source-map-js";
import { SessionBuild } from "../../../CompileCode/Session";
import InsertComponent from "../../../CompileCode/InsertComponent";


export function createImporter(originalPath: string) {
    return {
        findFileUrl(url: string) {
            if (url[0] == '/' || url[0] == '~') {
                return new URL(
                    url.substring(1),
                    pathToFileURL(url[0] == '/' ? getTypes.Static[0] : getTypes.node_modules[0])
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

export function sassSyntax(language: 'sass' | 'scss' | 'css') {
    return language == 'sass' ? 'indented' : language;
}

export function sassAndSource(sourceMap: RawSourceMap, source: string) {
    if (!sourceMap) return;
    for (const i in sourceMap.sources) {
        if (sourceMap.sources[i].startsWith('data:')) {
            sourceMap.sources[i] = source;
        }
    }
}

export function getSassErrorLine({ sassStack }) {
    const loc = sassStack.match(/[0-9]+:[0-9]+/)[0].split(':').map(x => Number(x));
    return { line: loc[0], column: loc[1] }
}

export function PrintSassError(err: any, {line, column} = getSassErrorLine(err)){
    PrintIfNew({
        text: `${err.message},\non file -> ${fileURLToPath(err.span.url)}:${line ?? 0}:${column ?? 0}`,
        errorName: err?.status == 5 ? 'sass-warning' : 'sass-error',
        type: err?.status == 5 ? 'warn' : 'error'
    });
}

export function PrintSassErrorTracker(err: any, track: StringTracker){
    if(err.span.url) return PrintSassError(err);

    err.location = getSassErrorLine(err);
    PrintIfNew({
        text: track.debugLine(err),
        errorName: err?.status == 5 ? 'sass-warning' : 'sass-error',
        type: err?.status == 5 ? 'warn' : 'error'
    });
}

export async function compileSass(language: string, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild, outStyle = BetweenTagData.eq) {
    const thisPage = BasicSettings.fullWebSitePath + BetweenTagData.extractInfo(),
        thisPageURL = pathToFileURL(thisPage),
        compressed = minifyPluginSass(language, InsertComponent.SomePlugins);

    let result: sass.CompileResult;
    try {
        result = await sass.compileStringAsync(outStyle, {
            sourceMap: sessionInfo.debug,
            syntax: sassSyntax(<any>language),
            style: compressed ? 'compressed' : 'expanded',
            importer: createImporter(thisPage),
            logger: sass.Logger.silent
        });
        outStyle = result?.css ?? outStyle;
    } catch (err) {
        const FullPath = fileURLToPath(err.span.url);
        await sessionInfo.dependence(BasicSettings.relative(FullPath), FullPath)
        PrintSassErrorTracker(err, BetweenTagData);
        return {outStyle: 'Sass Error (see console)'}
    }

    if (result?.loadedUrls) {
        for (const file of result.loadedUrls) {
            const FullPath = fileURLToPath(<any>file);
            await sessionInfo.dependence(BasicSettings.relative(FullPath), FullPath)
        }
    }

    result?.sourceMap && sassAndSource(result.sourceMap, thisPageURL.href);
    return { result, outStyle, compressed };
}