// @ts-nocheck
import { createRequire } from 'module';
import clearModule from 'clear-module';
import path from 'path';

export const DEFAULT_EXPORT_STRING = 'module.exports = '
export const SOURCE_MAP_SUPPORT = 'require("source-map-support").install()'

const require = createRequire(import.meta.url), resolve = (path: string) => require.resolve(path);

export async function nodeImportWithoutCache(filePath: string) {
    filePath = path.normalize(filePath);
    filePath = resolve(filePath)

    const module = require(filePath);
    clearModule(filePath);

    return module;
}

export async function nodeClearImport(module: string){
    clearModule(resolve(module));
}

