import EasyFs from '../OutputInput/EasyFs.js';
import { Insert, Components } from '../CompileCode/InsertModels.js';
import { ClearWarning } from '../OutputInput/PrintNew.js';
import * as SearchFileSystem from './SearchFileSystem.js';
import ReqScript from '../ImportFiles/Script.js';
import StaticFiles from '../ImportFiles/StaticFiles.js';
import path from 'path';
export function RemoveEndType(string) {
    return string.substring(0, string.lastIndexOf('.'));
}
Components.RemoveEndType = RemoveEndType;
async function compileFile(filePath, arrayType, isDebug, debugFromPage, sessionInfo) {
    const FullFilePath = path.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + '.cjs';
    const dependenceObject = {
        thisPage: await EasyFs.stat(FullFilePath, 'mtimeMs')
    };
    const html = await EasyFs.readFile(FullFilePath, 'utf8');
    const ExcluUrl = (debugFromPage ? debugFromPage + ' -> ' : '') + arrayType[2] + '/' + filePath;
    const CompiledData = await Insert(html, FullPathCompile, FullFilePath, arrayType[2], ExcluUrl, isDebug, dependenceObject, Boolean(debugFromPage), sessionInfo);
    if (!debugFromPage) {
        await EasyFs.writeFile(FullPathCompile, CompiledData);
        await SearchFileSystem.UpdatePageDependency(RemoveEndType(ExcluUrl), dependenceObject);
    }
    return { CompiledData, dependenceObject };
}
function isFileType(types, name) {
    name = name.toLowerCase();
    for (const type of types) {
        if (name.endsWith('.' + type)) {
            return true;
        }
    }
    return false;
}
async function FilesInFolder(arrayType, path = "") {
    const allInFolder = await EasyFs.readdir(arrayType[0] + path, { withFileTypes: true });
    for (const i of allInFolder) {
        const n = i.name;
        if (i.isDirectory()) {
            await EasyFs.mkdir(arrayType[1] + path + n);
            await FilesInFolder(arrayType, path + n + '/');
        }
        else {
            if (isFileType(SearchFileSystem.BasicSettings.pageTypesArray, n)) {
                await compileFile(path + n, arrayType);
            }
            else if (arrayType == SearchFileSystem.getTypes.Static && isFileType(SearchFileSystem.BasicSettings.ReqFileTypesArray, n)) {
                await ReqScript(n, arrayType);
            }
            else {
                await StaticFiles(n, false);
            }
        }
    }
}
async function CreateCompile(t) {
    const types = SearchFileSystem.getTypes[t];
    await SearchFileSystem.DeleteInDirectory(types[1]);
    await FilesInFolder(types);
}
/**
 * when page call other page;
 * @param path
 * @param arrayType
 */
async function FastCompileInFile(path, arrayType, debugFromPage, sessionInfo) {
    await EasyFs.makePathReal(path, arrayType[1]);
    return await compileFile(path, arrayType, true, debugFromPage, sessionInfo);
}
Components.CompileInFile = FastCompileInFile;
export async function FastCompile(path, arrayType) {
    await FastCompileInFile(path, arrayType);
    ClearWarning();
}
export async function compileAll() {
    SearchFileSystem.ClearPagesDependency();
    // await CheckPath(path,  SearchFileSystem.getTypes.Logs[1]);
    // await CheckPath(path, SearchFileSystem.getTypes.Static[1]);
    await CreateCompile(SearchFileSystem.getTypes.Static[2]);
    await CreateCompile(SearchFileSystem.getTypes.Logs[2]);
    ClearWarning();
}
