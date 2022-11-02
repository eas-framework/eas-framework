import sass from 'sass';
import {fileURLToPath, pathToFileURL} from "node:url";
import DepCreator from '../../../../../../../../ImportSystem/Dependencies/DepCreator.js';
import PPath from '../../../../../../../../Settings/PPath.js';
import {GlobalSettings} from '../../../../../../../../Settings/GlobalSettings.js';
import EasyFS from '../../../../../../../../Util/EasyFS.js';
import {importer, style, syntax, updateSourceToFile} from '../../../../../../../../Compilers/Sass/utils.js';
import {logSassError} from '../../../../../../../../Compilers/Sass/Errors.js';
import {toURLComment} from '../../../../../../../../SourceTracker/SourceMap/utils.js';
import {makeWebURLSourceStaticFile} from '../../../../../../../../SourceTracker/SourceMap/SourceComputeTrack.js';

export async function compileSass(file: PPath, deps: DepCreator, language: "sass" | "scss" | "css") {
    const fileData = await EasyFS.readFile(file.full);
    let dataResult = '/*Compilation Error*/';

    try {
        const result = await sass.compileStringAsync(fileData, {
            sourceMap: GlobalSettings.development,
            syntax: syntax(language),
            style: style(language),
            logger: sass.Logger.silent,
            importer: importer(file),
        });

        if (result?.loadedUrls) { // add loaded urls to dependencies
            const nestedDeps = deps.nestedDepFile(file);
            for (const file of result.loadedUrls) {
                const fullPath = fileURLToPath(<any>file);
                await nestedDeps.updateDep(PPath.fromFull(fullPath));
            }
        }

        dataResult = result.css;

        if (GlobalSettings.development && result.sourceMap) { // add source map to file content
            updateSourceToFile(result.sourceMap, pathToFileURL(file.full).href);

            result.sourceMap.sources = result.sourceMap.sources.map(x =>
                makeWebURLSourceStaticFile(
                    PPath.fromFull(
                        fileURLToPath(x)
                    ).nested
                )
            );

            dataResult += toURLComment(JSON.stringify(result.sourceMap), true);
        }
    } catch (err) {
        logSassError(err);
    }

    await EasyFS.writeFileAndPath(file.compile, dataResult);
    await deps.updateDep(file);
}