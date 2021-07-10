import EasyFs from '../OutputInput/EasyFs';
import { Dirent } from 'fs';
import { Insert, Components } from '../CompileCode/InsertModels';
import { ClearWarning } from '../OutputInput/PrintNew'
import * as SearchFileSystem from './SearchFileSystem';
import ReqScript from '../ImportFiles/Script';
import StaticFiles from '../ImportFiles/StaticFiles';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';

export function RemoveEndType(string) {
    return string.substring(0, string.lastIndexOf('.'));
}
Components.RemoveEndType = RemoveEndType;

async function compileFile(path: string, arrayType: string[], isDebug?: boolean, debugFromPage?: string, sessionInfo?: StringAnyMap) {
    const FullFilePath = arrayType[0] + path, FullPathCompile = arrayType[1] + path + '.js';
    const dependenceObject: any = {
        thisPage: await EasyFs.stat(FullFilePath, 'mtimeMs')
    };

    const html = await EasyFs.readFile(FullFilePath, 'utf8');
    const ExcluUrl = (debugFromPage ? debugFromPage + ' -> ' : '') + arrayType[2] + '/' + path;

    const CompiledData = await Insert(html, FullPathCompile, FullFilePath, ExcluUrl, isDebug, dependenceObject, Boolean(debugFromPage), sessionInfo);

    if (!debugFromPage) {
        await EasyFs.writeFile(FullPathCompile, CompiledData);
        await SearchFileSystem.UpdatePageDependency(RemoveEndType(ExcluUrl), dependenceObject);
    }

    return { CompiledData, dependenceObject };
}

function isFileType(types: string[], name: string) {
    for (const type in types) {
        name = name.toLowerCase();
        return name.endsWith('.' + type);
    }
}

async function FilesInFolder(arrayType: string[], path = "") {
    const allInFolder = await EasyFs.readdir(arrayType[0] + path, { withFileTypes: true });

    for (const i of <Dirent[]>allInFolder) {
        const n = i.name;
        if (i.isDirectory()) {
            await EasyFs.mkdir(arrayType[1] + path + n);
            await FilesInFolder(arrayType, path + n + '/');
        }
        else {
            if (isFileType(SearchFileSystem.BasicSettings.pageTypesArray, n)) {
                await compileFile(path + n, arrayType);
            } else if(arrayType == SearchFileSystem.getTypes.Static && isFileType(SearchFileSystem.BasicSettings.ReqFileTypesArray, n)){
                await ReqScript(n, arrayType);
            } else {
                await StaticFiles(n, false);
            }
        }
    }
}

async function CreateCompile(t:string) {
    const types = SearchFileSystem.getTypes[t];
    await SearchFileSystem.DeleteInDirectory(types[1]);
    await FilesInFolder(types);
}



/**
 * when page call other page;
 * @param path 
 * @param arrayType 
 */
async function FastCompileInFile(path: string, arrayType: string[], debugFromPage?: string, sessionInfo?: StringAnyMap) {
    await EasyFs.makePathReal(path, arrayType[1]);
    return await compileFile(path, arrayType, true, debugFromPage, sessionInfo);
}

Components.CompileInFile = FastCompileInFile;

export async function FastCompile(path: string, arrayType: string[]) {
    await FastCompileInFile(path, arrayType);
    ClearWarning();
}

export async function compileAll() {
    SearchFileSystem.ClearPagesDependency();
    // await CheckPath(path,  SearchFileSystem.getTypes.Logs[1]);
    // await CheckPath(path, SearchFileSystem.getTypes.Static[1]);
    await CreateCompile('Static');
    await CreateCompile('Logs');
    ClearWarning();
}