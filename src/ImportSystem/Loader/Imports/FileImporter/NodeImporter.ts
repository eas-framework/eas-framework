// @ts-nocheck
import {createRequire} from 'module';
import clearModule from 'clear-module';
import {injectionParamObject} from '../../../../Compilers/EASSyntax/InjectScripts.js';
import {GlobalSettings} from '../../../../Settings/GlobalSettings.js';
import path from 'node:path';

export const DEFAULT_EXPORT_STRING = 'exports.default = ';
export const EXPORT_STRING_EAS_SYNTAX = 'exports.default = ';
export const SOURCE_MAP_SUPPORT = "require('source-map-support').install()";
export const IMPORT_FILE_EXTENSION = '.cjs';

const require = createRequire(import.meta.url);

export async function importEASScript(filePath: string) {
    filePath = path.normalize(filePath);

    const module = require(filePath);
    if (GlobalSettings.development) {
        clearModule(filePath); // for hot reload
    }

    return (...args: any[]) => module.default(injectionParamObject, ...args);
}
