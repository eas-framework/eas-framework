import EasyFs from '../OutputInput/EasyFs.js';
import { Insert, Components, GetPlugin } from '../CompileCode/InsertModels.js';
import { ClearWarning } from '../OutputInput/PrintNew.js';
import * as SearchFileSystem from './SearchFileSystem.js';
import ReqScript from '../ImportFiles/Script.js';
import StaticFiles from '../ImportFiles/StaticFiles.js';
import path from 'path';
import CompileState from './CompileState.js';
import { SessionBuild } from '../CompileCode/Session.js';
import { CheckDependencyChange, pageDeps } from '../OutputInput/StoreDeps.js';
import { argv } from 'process';
import { createSiteMap } from './SiteMap.js';
import { isFileType, RemoveEndType } from './FileTypes.js';
async function compileFile(filePath, arrayType, isDebug, hasSessionInfo, nestedPage, nestedPageData) {
    const FullFilePath = path.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + '.cjs';
    const dependenceObject = {
        thisPage: await EasyFs.stat(FullFilePath, 'mtimeMs')
    };
    const html = await EasyFs.readFile(FullFilePath, 'utf8');
    const ExcluUrl = (nestedPage ? nestedPage + '<line>' : '') + arrayType[2] + '/' + filePath;
    const sessionInfo = hasSessionInfo ?? new SessionBuild(arrayType[2] + '/' + filePath, arrayType[2], isDebug && !GetPlugin("SafeDebug"));
    const CompiledData = await Insert(html, FullPathCompile, FullFilePath, ExcluUrl, isDebug, dependenceObject, Boolean(nestedPage), nestedPageData, sessionInfo);
    if (!nestedPage) {
        await EasyFs.writeFile(FullPathCompile, CompiledData);
        pageDeps.update(RemoveEndType(ExcluUrl), dependenceObject);
    }
    return { CompiledData, dependenceObject, sessionInfo };
}
async function FilesInFolder(arrayType, path, state) {
    const allInFolder = await EasyFs.readdir(arrayType[0] + path, { withFileTypes: true });
    for (const i of allInFolder) {
        const n = i.name, connect = path + n;
        if (i.isDirectory()) {
            await EasyFs.mkdir(arrayType[1] + connect);
            await FilesInFolder(arrayType, connect + '/', state);
        }
        else {
            if (isFileType(SearchFileSystem.BasicSettings.pageTypesArray, n)) {
                state.addPage(connect, arrayType[2]);
                if (await CheckDependencyChange(arrayType[2] + '/' + connect)) //check if not already compile from a 'in-file' call
                    await compileFile(connect, arrayType, false);
            }
            else if (arrayType == SearchFileSystem.getTypes.Static && isFileType(SearchFileSystem.BasicSettings.ReqFileTypesArray, n)) {
                state.addImport(connect);
                await ReqScript('Production Loader - ' + arrayType[2], connect, arrayType, false);
            }
            else {
                state.addFile(connect);
                await StaticFiles(connect, false);
            }
        }
    }
}
async function RequireScripts(scripts) {
    for (const path of scripts) {
        await ReqScript('Production Loader', path, SearchFileSystem.getTypes.Static, false);
    }
}
async function CreateCompile(t, state) {
    const types = SearchFileSystem.getTypes[t];
    await SearchFileSystem.DeleteInDirectory(types[1]);
    return () => FilesInFolder(types, '', state);
}
/**
 * when page call other page;
 */
async function FastCompileInFile(path, arrayType, sessionInfo, nestedPage, nestedPageData) {
    await EasyFs.makePathReal(path, arrayType[1]);
    return await compileFile(path, arrayType, true, sessionInfo, nestedPage, nestedPageData);
}
Components.CompileInFile = FastCompileInFile;
export async function FastCompile(path, arrayType) {
    await FastCompileInFile(path, arrayType);
    ClearWarning();
}
export async function compileAll(Export) {
    let state = !argv.includes('rebuild') && await CompileState.checkLoad();
    if (state)
        return () => RequireScripts(state.scripts);
    pageDeps.clear();
    state = new CompileState();
    const activateArray = [await CreateCompile(SearchFileSystem.getTypes.Static[2], state), await CreateCompile(SearchFileSystem.getTypes.Logs[2], state), ClearWarning];
    return async () => {
        for (const i of activateArray) {
            await i();
        }
        await createSiteMap(Export, state);
        state.export();
    };
}
//# sourceMappingURL=SearchPages.js.map