import path from "path";
import { ImportFile } from "../ImportFiles/Script";
import { ExportSettings } from "../MainBuild/SettingsTypes";
import EasyFs, { Dirent } from "../OutputInput/EasyFs";
import CompileState from "./CompileState";
import { isFileType } from "./FileTypes";
import { BasicSettings, getTypes } from "./SearchFileSystem";

async function FilesInFolder(arrayType: string[], path: string, state: CompileState) {
    const allInFolder = await EasyFs.readdir(arrayType[0] + path, { withFileTypes: true });

    const promises =[];
    for (const i of <Dirent[]>allInFolder) {
        const n = i.name, connect = path + n;
        if (i.isDirectory()) {
            promises.push(FilesInFolder(arrayType, connect + '/', state));
        }
        else {
            if (isFileType(BasicSettings.pageTypesArray, n)) {
                state.addPage(connect, arrayType[2]);
            } else if (arrayType == getTypes.Static && isFileType(BasicSettings.ReqFileTypesArray, n)) {
                state.addImport(connect);
            } else {
                state.addFile(connect);
            }
        }
    }

    return Promise.all(promises);
}

async function scanFiles(){
    const state = new CompileState();
    await Promise.all([
        FilesInFolder(getTypes.Static, '', state),
        FilesInFolder(getTypes.Logs, '', state)
    ])
    return state;
}

export async function debugSiteMap(Export: ExportSettings){
    return createSiteMap(Export, await scanFiles());
}

export async function createSiteMap(Export: ExportSettings, state: CompileState) {
    const { routing, development } = Export;
    if (!routing.sitemap) return;

    const sitemap = routing.sitemap === true ? {} : routing.sitemap;
    Object.assign(sitemap, {
        rules: true,
        urlStop: false,
        errorPages: false,
        validPath: true
    });

    const pages: string[] = [];

    urls: //eslint-disable-next-line 
    for (let [url, type] of state.pages) {

        if(type != getTypes.Static[2] || !url.endsWith('.' + BasicSettings.pageTypes.page))
            continue;

        url = '/' + url.substring(0, url.length - BasicSettings.pageTypes.page.length - 1);

        if(path.extname(url) == '.serv')
            continue;

        if (sitemap.urlStop) {
            for (const path in routing.urlStop) {
                if (url.startsWith(path)) {
                    url = path;
                }
                break;
            }
        }

        if (sitemap.rules) {
            for (const path in routing.rules) {
                if (url.startsWith(path)) {
                    url = await routing.rules[path](url);
                    break;
                }
            }
        }

        if (
            routing.ignoreTypes.find(ends => url.endsWith('.'+ends)) ||
            routing.ignorePaths.find(start => url.startsWith(start))
        )
            continue;

        if (sitemap.validPath) {
            for (const func of routing.validPath) {
                if (!await func(url))
                    continue urls;
            }
        }

        if (!sitemap.errorPages) {
            for (const error in routing.errorPages) {
                const path = '/' + routing.errorPages[error].path;

                if (url.startsWith(path)) {
                    continue urls;
                }
            }
        }
        pages.push(url);
    }

    let write = true;
    if (sitemap.file) {
        const fileAction = await ImportFile('Sitemap Import', sitemap.file, getTypes.Static, development);
        if(!fileAction?.Sitemap){
            dump.warn('\'Sitemap\' function not found on file -> '+ sitemap.file);
        } else {
            write = await fileAction.Sitemap(pages, state, Export);
        }
    }

    if(write && pages.length){
        const path = write === true ? 'sitemap.txt': write;
        state.addFile(path);
        await EasyFs.writeFile(getTypes.Static[0] + path, pages.join('\n'));
    }
}