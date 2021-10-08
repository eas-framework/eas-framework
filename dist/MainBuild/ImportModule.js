import { getTypes } from '../RunTimeBuild/SearchFileSystem.js';
import ImportFile, { AddExtension, RequireOnce } from '../ImportFiles/Script.js';
import EasyFs from '../OutputInput/EasyFs.js';
import { print } from '../OutputInput/Console.js';
export async function StartRequire(array, isDebug) {
    const arrayFuncServer = [];
    for (let i of array) {
        i = AddExtension(i);
        const b = await ImportFile(i, getTypes.Static, isDebug);
        if (b && typeof b.StartServer == 'function') {
            arrayFuncServer.push(b.StartServer);
        }
        else {
            print.log("Can't find StartServer function at module - " + i);
        }
    }
    return arrayFuncServer;
}
export async function SettingsExsit(filePath) {
    return await EasyFs.existsFile(filePath + '.ts') || await EasyFs.existsFile(filePath + '.js');
}
export async function GetSettings(filePath, isDebug) {
    if (await EasyFs.existsFile(filePath + '.ts')) {
        filePath += '.ts';
    }
    else {
        filePath += '.js';
    }
    const data = await RequireOnce(filePath, isDebug);
    return data.default;
}
