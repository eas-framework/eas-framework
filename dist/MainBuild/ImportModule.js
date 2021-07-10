import { getTypes } from '../RunTimeBuild/SearchFileSystem.js';
import { ImportFile, AddExtension, RequireOnce } from '../ImportFiles/Script.js';
import EasyFs from '../OutputInput/EasyFs.js';
export async function StartRequire(array, isDebug) {
    const arrayFuncServer = [];
    for (let i of array) {
        i = AddExtension(i);
        const b = await ImportFile(i, getTypes.Static, isDebug);
        if (typeof b.StartServer == 'function') {
            arrayFuncServer.push(b.StartServer);
        }
    }
    return arrayFuncServer;
}
export async function SettingsExsit(filePath) {
    return await EasyFs.exists(filePath + '.ts') || await EasyFs.exists(filePath + '.js');
}
export async function GetSettings(filePath, isDebug) {
    if (await EasyFs.exists(filePath + '.ts')) {
        filePath += '.ts';
    }
    else {
        filePath += '.js';
    }
    const data = await RequireOnce(filePath, isDebug);
    return data.default;
}
//# sourceMappingURL=ImportModule.js.map