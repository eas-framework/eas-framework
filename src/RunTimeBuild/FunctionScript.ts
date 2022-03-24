import path from 'path';
import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings, getTypes } from './SearchFileSystem';
import { FastCompile } from './SearchPages';
import { print } from '../OutputInput/Console';
import { Request, Response } from '@tinyhttp/app';
import { Files } from 'formidable';
import { handelConnectorService } from '../BuildInComponents/index';
import ImportWithoutCache from '../ImportFiles/redirectCJS';
import { CutTheLast, SplitFirst } from '../StringMethods/Splitting';
import RequireFile from './ImportFileRuntime';
import { PrintIfNew } from '../OutputInput/PrintNew';
import { CheckDependencyChange } from '../OutputInput/StoreDeps';

const Export = {
    PageLoadRam: {},
    PageRam: true
}

/**
 * It loads a page and returns the model.
 * @param {string} filePath - The path to the file you want to import.
 * @param {string} __filename - The filename of the file that is currently being executed.
 * @param {string} __dirname - The directory of the file that is currently being executed.
 * @param {string[]} typeArray - The typeArray is an array of strings that contains the path to the
 * file.
 * @param LastRequire - A dictionary of all the files that have been required so far.
 * @param {any} DataObject - The data object that is passed to the page.
 * @returns A function that returns the page.
 */
async function RequirePage(filePath: string, __filename: string, __dirname: string, typeArray: string[], LastRequire: { [key: string]: any }, DataObject: any) {
    const ReqFilePath = LastRequire[filePath];
    const resModel = () => ReqFilePath.model(DataObject);

    let fileExists: boolean;

    if (ReqFilePath) {
        if (!DataObject.isDebug)
            return resModel();

        if (ReqFilePath.date == -1) {
            fileExists = await EasyFs.existsFile(ReqFilePath.path);

            if (!fileExists)
                return resModel();
        }

    }

    const copyPath = filePath;
    let extname = path.extname(filePath).substring(1);

    if (!extname) {
        extname = BasicSettings.pageTypes.page;
        filePath += '.' + extname;
    }

    let fullPath: string;
    if (filePath[0] == '.') {
        if (filePath[1] == '/')
            filePath = filePath.substring(2);
        else
            filePath = filePath.substring(1);

        fullPath = path.join(__dirname, filePath)
    } else
        fullPath = path.join(typeArray[0], filePath);

    if (![BasicSettings.pageTypes.page, BasicSettings.pageTypes.component].includes(extname)) {
        const importText = await EasyFs.readFile(fullPath);
        DataObject.write(importText);
        return importText;
    }

    fileExists = fileExists ?? await EasyFs.existsFile(fullPath);
    if (!fileExists) {
        PrintIfNew({
            type: 'warn',
            errorName: 'import-not-exists',
            text: `Import '${copyPath}' does not exists from '${__filename}'`
        })
        LastRequire[copyPath] = { model: () => { }, date: -1, path: fullPath };
        return LastRequire[copyPath].model;
    }

    const ForSavePath = typeArray[2] + '/' + filePath.substring(0, filePath.length - extname.length - 1);
    const reBuild = DataObject.isDebug && (!await EasyFs.existsFile(typeArray[1] + filePath + '.cjs') || await CheckDependencyChange(ForSavePath));

    if (reBuild)
        await FastCompile(filePath, typeArray);


    if (Export.PageLoadRam[ForSavePath] && !reBuild) {
        LastRequire[copyPath] = { model: Export.PageLoadRam[ForSavePath][0] };
        return await LastRequire[copyPath].model(DataObject);
    }

    const func = await LoadPage(ForSavePath, extname);
    if (Export.PageRam) {
        if (!Export.PageLoadRam[ForSavePath]) {
            Export.PageLoadRam[ForSavePath] = [];
        }
        Export.PageLoadRam[ForSavePath][0] = func;
    }

    LastRequire[copyPath] = { model: func };
    return await func(DataObject);
}

const GlobalVar = {};

function getFullPathCompile(url: string) {
    const SplitInfo = SplitFirst('/', url);
    const typeArray = getTypes[SplitInfo[0]];
    return typeArray[1] + SplitInfo[1] + "." + BasicSettings.pageTypes.page + '.cjs';
}

/**
 * It loads a page.
 * @param {string} url - The URL of the page to load.
 * @param ext - The extension of the file.
 * @returns A function that takes a data object and returns a string.
 */
async function LoadPage(url: string, ext = BasicSettings.pageTypes.page) {
    const SplitInfo = SplitFirst('/', url);

    const typeArray = getTypes[SplitInfo[0]];
    const LastRequire = {};

    function _require(__filename: string, __dirname: string, DataObject: any, p: string) {
        return RequireFile(p, __filename, __dirname, typeArray, LastRequire, DataObject.isDebug);
    }

    function _include(__filename: string, __dirname: string, DataObject: any, p: string, WithObject = {}) {
        return RequirePage(p, __filename, __dirname, typeArray, LastRequire, { ...WithObject, ...DataObject });
    }

    function _transfer(p: string, preserveForm: boolean, withObject: any, __filename: string, __dirname: string, DataObject: any) {
        DataObject.out_run_script.text = '';

        if (!preserveForm) {
            const postData = DataObject.Request.body ? {} : null;
            DataObject = {
                ...DataObject,
                Request: { ...DataObject.Request, files: {}, query: {}, body: postData },
                Post: postData, Query: {}, Files: {}
            }
        }

        return _include(__filename, __dirname, DataObject, p, withObject);

    }

    const compiledPath = path.join(typeArray[1], SplitInfo[1] + "." + ext + '.cjs');
    const private_var = {};

    try {
        const MyModule = await ImportWithoutCache(compiledPath);

        return MyModule(_require, _include, _transfer, private_var, handelConnectorService);
    } catch (e) {
        const debug__filename = url + "." + ext;
        print.error("Error path -> ", debug__filename, "->", e.message);
        print.error(e.stack);
        return (DataObject: any) => DataObject.out_run_script.text += `<div style="color:red;text-align:left;font-size:16px;"><p>Error path: ${debug__filename}</p><p>Error message: ${e.message}</p></div>`;
    }
}
/**
 * It takes a function that prepare a page, and returns a function that loads a page
 * @param LoadPageFunc - A function that takes in a page to execute on
 * @param {string} run_script_name - The name of the script to run.
 * @returns a function that returns a promise.
 */

function BuildPage(LoadPageFunc: (...data: any[]) => void, run_script_name: string) {
    const PageVar = {};

    return (async function (Response: Response, Request: Request, Post: { [key: string]: any } | null, Query: { [key: string]: any }, Cookies: { [key: string]: any }, Session: { [key: string]: any }, Files: Files, isDebug: boolean) {
        const out_run_script = { text: '' };

        function ToStringInfo(str: any) {
            const asString = str?.toString?.();
            if (asString == null || asString.startsWith('[object Object]')) {
                return JSON.stringify(str, null, 2);
            }
            return asString;
        }

        function setResponse(text: any) {
            out_run_script.text = ToStringInfo(text);
        }

        function write(text = '') {
            out_run_script.text += ToStringInfo(text);
        };

        function writeSafe(str = '') {
            str = ToStringInfo(str);

            for (const i of str) {
                out_run_script.text += '&#' + i.charCodeAt(0) + ';';
            }
        }

        function echo(arr: string[], ...params: any[]) {
            for (const i in params) {
                out_run_script.text += arr[i];
                writeSafe(params[i]);
            }

            out_run_script.text += arr.at(-1);
        }

        let redirectPath: any = false;

        Response.redirect = (path: string, status?: number) => {
            redirectPath = String(path);
            if (status != null) {
                Response.status(status);
            }

            return Response;
        };

        (<any>Response).reload = () => {
            Response.redirect(Request.url);
        }

        function sendFile(filePath, deleteAfter = false) {
            redirectPath = { file: filePath, deleteAfter };
        }

        const DataSend = {
            sendFile,
            writeSafe,
            write,
            echo,
            setResponse,
            out_run_script,
            run_script_name,
            Response,
            Request,
            Post,
            Query,
            Session,
            Files,
            Cookies,
            isDebug,
            PageVar,
            GlobalVar,
            codebase: ''
        }

        await LoadPageFunc(DataSend);

        return { out_run_script: out_run_script.text, redirectPath }
    })
}

export { LoadPage, BuildPage, getFullPathCompile, Export, SplitFirst };