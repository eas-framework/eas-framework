import { getTypes } from '../RunTimeBuild/SearchFileSystem';
import {ImportFile, RequireOnce} from '../ImportFiles/Script';
import EasyFs from '../OutputInput/EasyFs';

export async function StartRequire(array: string[], isDebug: boolean) {
    const arrayFuncServer = [];
    for (const i of array) {
        const b = await ImportFile(i, getTypes.Static, isDebug);
        if (typeof b.StartServer == 'function') {
            arrayFuncServer.push(b.StartServer);
        }
    }

    return arrayFuncServer;
}

export async function SettingsExsit(filePath: string){
    return await EasyFs.existsFile(filePath + '.ts') || await EasyFs.existsFile(filePath + '.js');
}

export async function GetSettings(filePath: string, isDebug: boolean){
    if(await EasyFs.existsFile(filePath + '.ts')){
        filePath += '.ts';
    } else {
        filePath += '.js'
    }
    const data = await RequireOnce(filePath, isDebug);
    return data.default;
}