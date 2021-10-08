import { getTypes } from '../RunTimeBuild/SearchFileSystem';
import {ImportFile, AddExtension, RequireOnce} from '../ImportFiles/Script';
import EasyFs from '../OutputInput/EasyFs';
import {print} from '../OutputInput/Console'

export async function StartRequire(array: string[], isDebug: boolean) {
    const arrayFuncServer = [];
    for (let i of array) {
        i = AddExtension(i);

        const b = await ImportFile(i, getTypes.Static, isDebug);
        if (b && typeof b.StartServer == 'function') {
            arrayFuncServer.push(b.StartServer);
        } else {
            print.log("Can't find StartServer function at module - " + i);
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