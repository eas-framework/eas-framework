import {copyJSON, mergeNested1} from "../Util/MergeObjects.js";
import {GlobalSettings} from "./GlobalSettings.js";
import {ExportSettings} from "./types.js";
import {Server} from "http";
import {Http2Server} from "http2";
import {App as TinyApp} from '@tinyhttp/app';
import {FileImporter} from '../ImportSystem/Loader/index.js';
import PPath from './PPath.js';
import {directories} from './ProjectConsts.js';
import easyFS from '../Util/EasyFS.js';
import {cacheFunc} from '../ProcessRequest/ScriptLoader/Senders/utils.js';


const IMPORT_LOAD_METHOD = 'main';

export const getSettingsFile = cacheFunc(async function (settingsFile = GlobalSettings.settingsFile) {
    const baseFile = PPath.fromNested(directories.Locate.system, settingsFile);
    const jsFile = baseFile.clone();
    jsFile.nested += '.js';

    if (await easyFS.existsFile(baseFile.full)) {
        return jsFile;
    }

    baseFile.nested += '.ts';
    return baseFile;
});

async function loadFile(settingsFile): Promise<any> {
    const settingFile = await getSettingsFile(settingsFile);
    return new FileImporter(settingFile, {displayNotFoundError: false}).createImport();
}

let loadedFilesMethods = [];

async function importOnLoad(array: string[]) {
    const imports = [];
    for (const file of array) {
        const filePath = PPath.fromNested(directories.Locate.static, file);
        imports.push(new FileImporter(filePath).createImport());
    }

    const allImports = await Promise.all(imports);
    loadedFilesMethods = allImports.map(exports => typeof exports?.[IMPORT_LOAD_METHOD] === 'function').filter(Boolean);
}

export async function callImportOnLoadMethods(app: TinyApp, server: Server | Http2Server) {
    for (const method of loadedFilesMethods) {
        await method(app, server, GlobalSettings);
    }
}

export async function loadSettings(settingsFile = GlobalSettings.settingsFile) {
    const settings: ExportSettings = await loadFile(settingsFile);
    if (!settings) return;

    if (settings.development) {
        mergeNested1(settings, <any>settings.implDev);
    } else {
        mergeNested1(settings, <any>settings.implProd);
    }

    copyJSON(GlobalSettings, settings, ['development', 'implDev', 'implProd']);
    await importOnLoad(GlobalSettings.general.importOnLoad ?? []);

    GlobalSettings.development = settings.development;
}

GlobalSettings.reload = loadSettings;