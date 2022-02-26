import EasyFs from '../OutputInput/EasyFs';
import { Dirent } from 'fs';
import { Insert, Components } from '../CompileCode/InsertModels';
import { ClearWarning } from '../OutputInput/PrintNew'
import * as SearchFileSystem from './SearchFileSystem';
import ReqScript from '../ImportFiles/Script';
import StaticFiles from '../ImportFiles/StaticFiles';
import { SessionInfo } from '../CompileCode/XMLHelpers/CompileTypes';
import path from 'path';
import CompileState from './CompileState';

export function RemoveEndType(string) {
    return string.substring(0, string.lastIndexOf('.'));
}
Components.RemoveEndType = RemoveEndType;

async function compileFile(filePath: string, arrayType: string[], isDebug?: boolean, debugFromPage?: string, sessionInfo?: SessionInfo) {
    const FullFilePath = path.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + '.cjs';
    const dependenceObject: any = {
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

function isFileType(types: string[], name: string) {
    name = name.toLowerCase();

    for (const type of types) {
        if (name.endsWith('.' + type)) {
            return true;
        }
    }
    return false;
}

async function FilesInFolder(arrayType: string[], path: string, state: CompileState) {
    const allInFolder = await EasyFs.readdir(arrayType[0] + path, { withFileTypes: true });

    for (const i of <Dirent[]>allInFolder) {
        const n = i.name, connect = path + n;
        if (i.isDirectory()) {
            await EasyFs.mkdir(arrayType[1] + connect);
            await FilesInFolder(arrayType, connect + '/', state);
        }
        else {
            if (isFileType(SearchFileSystem.BasicSettings.pageTypesArray, n)) {
                state.addPage(connect);
                if (await SearchFileSystem.CheckDependencyChange(arrayType[2] + '/' + connect)) //check if not already compile from a 'in-file' call
                    await compileFile(connect, arrayType, false);
            } else if (arrayType == SearchFileSystem.getTypes.Static && isFileType(SearchFileSystem.BasicSettings.ReqFileTypesArray, n)) {
                state.addImport(connect);
                await ReqScript('Production Loader', connect, arrayType, false);
            } else {
                await StaticFiles(connect, false);
            }
        }
    }
}

async function RequireScripts(scripts: string[]) {
    for (const path of scripts) {
        await ReqScript('Production Loader', path, SearchFileSystem.getTypes.Static, false);
    }
}

async function CreateCompile(t: string, state: CompileState) {
    const types = SearchFileSystem.getTypes[t];
    await SearchFileSystem.DeleteInDirectory(types[1]);
    return () => FilesInFolder(types, '', state);
}



/**
 * when page call other page;
 */
async function FastCompileInFile(path: string, arrayType: string[], debugFromPage?: string, sessionInfo?: SessionInfo) {
    await EasyFs.makePathReal(path, arrayType[1]);
    return await compileFile(path, arrayType, true, debugFromPage, sessionInfo);
}

Components.CompileInFile = FastCompileInFile;

export async function FastCompile(path: string, arrayType: string[]) {
    await FastCompileInFile(path, arrayType);
    ClearWarning();
}

export async function compileAll() {
    let state = await CompileState.checkLoad()

    if (state) return () => RequireScripts(state.scripts)
    SearchFileSystem.ClearPagesDependency();
    state = new CompileState()

    const activateArray = [await CreateCompile(SearchFileSystem.getTypes.Static[2], state), await CreateCompile(SearchFileSystem.getTypes.Logs[2], state), ClearWarning];

    return async () => {
        for (const i of activateArray) {
            await i();
        }
        state.export()
    }
}