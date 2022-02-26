import { getTypes } from '../RunTimeBuild/SearchFileSystem.js';
import ImportFile, { AddExtension, RequireOnce } from '../ImportFiles/Script.js';
import EasyFs from '../OutputInput/EasyFs.js';
import { print } from '../OutputInput/Console.js';
export async function StartRequire(array, isDebug) {
    const arrayFuncServer = [];
    for (let i of array) {
        i = AddExtension(i);
        const b = await ImportFile('root folder (WWW)', i, getTypes.Static, isDebug);
        if (b && typeof b.StartServer == 'function') {
            arrayFuncServer.push(b.StartServer);
        }
        else {
            print.log(`Can't find StartServer function at module - ${i}\n`);
        }
    }
    return arrayFuncServer;
}
let lastSettingsImport;
export async function GetSettings(filePath, isDebug) {
    if (await EasyFs.existsFile(filePath + '.ts')) {
        filePath += '.ts';
    }
    else {
        filePath += '.js';
    }
    const changeTime = await EasyFs.stat(filePath, 'mtimeMs', true);
    if (changeTime == lastSettingsImport || !changeTime)
        return null;
    lastSettingsImport = changeTime;
    const data = await RequireOnce(filePath, isDebug);
    return data.default;
}
export function getSettingsDate() {
    return lastSettingsImport;
}
//# sourceMappingURL=ImportModule.js.map