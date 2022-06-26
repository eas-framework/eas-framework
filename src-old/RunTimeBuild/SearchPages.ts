import EasyFs from '../OutputInput/EasyFs';
import { Dirent } from 'fs';
import { Insert, Components, GetPlugin } from '../CompileCode/InsertModels';
import { ClearWarning, PageTimeLogger } from '../OutputInput/Logger'
import { BasicSettings, DeleteInDirectory, getTypes } from './SearchFileSystem';
import ReqScript from '../ImportFiles/Script';
import StaticFiles from '../ImportFiles/StaticFiles';
import path from 'path';
import CompileState from './CompileState';
import { SessionBuild } from '../CompileCode/Session';
import { CheckDependencyChange, pageDeps } from '../OutputInput/StoreDeps';
import { ExportSettings } from '../MainBuild/SettingsTypes';
import { argv } from 'process';
import { extensionIs, isFileType } from './FileTypes';
import StringTracker from '../EasyDebug/StringTracker';
import { perCompile, postCompile, perCompilePage , postCompilePage } from '../CompileCode/Events';

async function compileFile(filePath: string, arrayType: string[], { isDebug, hasSessionInfo, nestedPage, nestedPageData, dynamicCheck }: { isDebug?: boolean, hasSessionInfo?: SessionBuild, nestedPage?: string, nestedPageData?: string, dynamicCheck?: boolean } = {}) {
    const startMeasureTime = performance.now();

    const FullFilePath = path.join(arrayType[0], filePath), FullPathCompile = arrayType[1] + filePath + '.cjs';

    const html = await EasyFs.readFile(FullFilePath, 'utf8');
    const SmallPath = (nestedPage ? nestedPage + '<line>' : '') + arrayType[2] + '/' + filePath;

    const sessionInfo = hasSessionInfo ?? new SessionBuild(arrayType[2] + '/' + filePath, FullFilePath, arrayType[2], isDebug, GetPlugin("SafeDebug"));
    await sessionInfo.dependence('thisPage', FullFilePath);

    await perCompilePage(sessionInfo, filePath, arrayType);
    const CompiledData = (await Insert(html, FullPathCompile, Boolean(nestedPage), nestedPageData, sessionInfo, dynamicCheck)) ?? new StringTracker();
    await postCompilePage(sessionInfo, filePath, arrayType);

    if (!nestedPage && CompiledData.length) {
        await EasyFs.writeFile(FullPathCompile, CompiledData.StringWithTack(FullPathCompile));
        pageDeps.update(SmallPath, sessionInfo.dependencies);
    }

    PageTimeLogger.dispatch('compile-time', { 
        time: Number(((performance.now() - startMeasureTime) / 1000).toFixed(3)), 
        file: filePath, 
        debug: isDebug 
    });

    return { CompiledData, sessionInfo };
}

function RequireScript(script: string) {
    return ReqScript(['Production Loader'], script, getTypes.Static, { isDebug: false, onlyPrepare: true });
}

async function FilesInFolder(arrayType: string[], path: string, state: CompileState) {
    const allInFolder = await EasyFs.readdir(arrayType[0] + path, { withFileTypes: true });

    const promises = [];
    for (const i of <Dirent[]>allInFolder) {
        const n = i.name, connect = path + n;
        if (i.isDirectory()) {
            await EasyFs.mkdir(arrayType[1] + connect);
            promises.push(FilesInFolder(arrayType, connect + '/', state));
        }
        else {
            if (isFileType(BasicSettings.pageTypesArray, n)) {
                state.addPage(connect, arrayType[2]);
                if (await CheckDependencyChange(arrayType[2] + '/' + connect)) //check if not already compile from a 'in-file' call
                    promises.push(compileFile(connect, arrayType, { dynamicCheck: !extensionIs(n, BasicSettings.pageTypes.page) }));
            } else if (arrayType == getTypes.Static && isFileType(BasicSettings.ReqFileTypesArray, n)) {
                state.addImport(connect);
                promises.push(RequireScript(connect));
            } else {
                state.addFile(connect);
                promises.push(StaticFiles(connect, false));
            }
        }
    }

    await Promise.all(promises);
}

async function RequireScripts(scripts: string[]) {
    for (const path of scripts) {
        await RequireScript(path);
    }
}

async function CreateCompile(t: string, state: CompileState) {
    const types = getTypes[t];
    await DeleteInDirectory(types[1]);
    return () => FilesInFolder(types, '', state);
}

/**
 * when page call other page;
 */
export async function FastCompileInFile(path: string, arrayType: string[], { hasSessionInfo, nestedPage, nestedPageData, dynamicCheck }: { hasSessionInfo?: SessionBuild, nestedPage?: string, nestedPageData?: string, dynamicCheck?: boolean } = {}) {
    await EasyFs.makePathReal(path, arrayType[1]);
    return await compileFile(path, arrayType, { isDebug: true, hasSessionInfo, nestedPage, nestedPageData, dynamicCheck });
}

export async function FastCompile(path: string, arrayType: string[], dynamicCheck?: boolean) {
    await FastCompileInFile(path, arrayType, { dynamicCheck });
    ClearWarning();
}

export async function compileAll(Export: ExportSettings) {
    let state = !argv.includes('rebuild') && await CompileState.checkLoad()

    if (state) return () => RequireScripts(state.scripts)
    pageDeps.clear();

    state = new CompileState()

    perCompile();

    const activateArray = [await CreateCompile(getTypes.Static[2], state), await CreateCompile(getTypes.Logs[2], state), ClearWarning];

    return async () => {
        PageTimeLogger.dispatch('start-compile');
        for (const i of activateArray) {
            await i();
        }
        PageTimeLogger.dispatch('end-compile');
        state.export()
        pageDeps.save();
        postCompile()
    }
}