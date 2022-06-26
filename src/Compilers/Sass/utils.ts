import { RawSourceMap } from "source-map-js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { GlobalSettings } from "../../Settings/GlobalSettings";
import PPath from "../../Settings/PPath";
import { directories } from "../../Settings/ProjectConsts";
import DepCreator from "../../ImportSystem/Dependencies/DepCreator";

export function syntax(language: 'sass' | 'scss' | 'css') {
    return language == 'sass' ? 'indented' : language;
}

export function style(language: string) {
    return GlobalSettings.development ? 'expanded' : 'compressed';
}

export function updateSourceToFile(sourceMap: RawSourceMap, source: string) {
    if (!sourceMap) return;
    for (const i in sourceMap.sources) {
        if (sourceMap.sources[i].startsWith('data:')) {
            sourceMap.sources[i] = source;
        }
    }
}

export function importer(file: PPath) {
    return {
        findFileUrl(url: string) {
            if (url[0] == '/' || url[0] == '^') {
                return new URL(
                    url.substring(1),
                    pathToFileURL(
                        url[0] == '/' ? directories.Locate.Static.source : directories.Locate.node_modules.source
                    )
                );
            }

            return new URL(url, pathToFileURL(file.full));
        }
    }
}

export function connectDependencies(result: any, file: PPath, deps: DepCreator) {
    if (result?.loadedUrls) { // add loaded urls to dependencies
        const nestedDeps = deps.nestedDepFile(file)
        for (const file of result.loadedUrls) {
            const fullPath = fileURLToPath(<any>file);
            nestedDeps.updateDep(PPath.fromFull(fullPath));
        }
    }
}