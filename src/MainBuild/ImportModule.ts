import { getTypes } from '../RunTimeBuild/SearchFileSystem';
import ImportFile, {AddExtension, RequireOnce} from '../ImportFiles/Script';
import EasyFs from '../OutputInput/EasyFs';
import {print} from '../OutputInput/Console'

export async function StartRequire(array: string[], isDebug: boolean) {
    const arrayFuncServer = [];
    for (let i of array) {
        i = AddExtension(i);

        const b = await ImportFile('root folder (WWW)', i, getTypes.Static, isDebug);
        if (b && typeof b.StartServer == 'function') {
            arrayFuncServer.push(b.StartServer);
        } else {
            print.log(`Can't find StartServer function at module - ${i}\n`);
        }
    }

    return arrayFuncServer;
}

let lastSettingsImport: number;
export async function GetSettings(filePath: string, isDebug: boolean){
    if(await EasyFs.existsFile(filePath + '.ts')){
        filePath += '.ts';
    } else {
        filePath += '.js'
    }
    const changeTime = <any>await EasyFs.stat(filePath, 'mtimeMs', true)

    if(changeTime == lastSettingsImport || !changeTime)
        return null;
    
    lastSettingsImport = changeTime;
    const data = await RequireOnce(filePath, isDebug);
    return data.default;
}