import { Request, Response } from '@tinyhttp/app';
import { Files } from 'formidable';
import path from 'path';
import { handelConnectorService } from '../BuildInComponents/index';
import JSParser from '../CompileCode/JSParser';
import ImportWithoutCache from '../ImportFiles/redirectCJS';
import { print } from '../OutputInput/Console';
import EasyFs from '../OutputInput/EasyFs';
import { createNewPrint } from '../OutputInput/Logger';
import { CheckDependencyChange } from '../OutputInput/StoreDeps';
import { SplitFirst } from '../StringMethods/Splitting';
import createDateWriter from './DataWriter';
import { RemoveEndType } from './FileTypes';
import RequireFile from './ImportFileRuntime';
import { BasicSettings, getTypes } from './SearchFileSystem';
import { FastCompile } from './SearchPages';

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
    if (filePath[0] == '.')
        fullPath = path.join(__dirname, filePath);
     else
        fullPath = path.join(typeArray[0], filePath);

    if (![BasicSettings.pageTypes.page, BasicSettings.pageTypes.component].includes(extname)) {
        const importText = await EasyFs.readFile(fullPath);
        DataObject.write(importText);
        return importText;
    }

    fileExists = fileExists ?? await EasyFs.existsFile(fullPath);
    if (!fileExists) {
        const [funcName, printText] = createNewPrint({
            type: 'warn',
            errorName: 'import-not-exists',
            text: `Import '${copyPath}' does not exists from <color>'${__filename}'`
        });
        print[funcName](printText);
        LastRequire[copyPath] = { model: () => { }, date: -1, path: fullPath };
        return LastRequire[copyPath].model;
    }

    const inStaticPath =  path.relative(typeArray[0],fullPath);
    const SmallPath = typeArray[2] + '/' + inStaticPath;
    const reBuild = DataObject.isDebug && (!await EasyFs.existsFile(typeArray[1] + '/' +inStaticPath + '.cjs') || await CheckDependencyChange(SmallPath));

    if (reBuild)
        await FastCompile(inStaticPath, typeArray, extname != BasicSettings.pageTypes.page);


    if (Export.PageLoadRam[SmallPath] && !reBuild) {
        LastRequire[copyPath] = { model: Export.PageLoadRam[SmallPath][0] };
        return await LastRequire[copyPath].model(DataObject);
    }

    const func = await LoadPage(SmallPath, DataObject.isDebug);
    if (Export.PageRam) {
        if (!Export.PageLoadRam[SmallPath]) {
            Export.PageLoadRam[SmallPath] = [];
        }
        Export.PageLoadRam[SmallPath][0] = func;
    }

    LastRequire[copyPath] = { model: func };
    return await func(DataObject);
}

const GlobalVar = {};

function getFullPathCompile(url: string) {
    const SplitInfo = SplitFirst('/', url);
    const typeArray = getTypes[SplitInfo[0]] ?? getTypes.Static;
    return typeArray[1] + SplitInfo[1] + '.cjs';
}

/**
 * It loads a page.
 * @param {string} url - The URL of the page to load.
 * @param ext - The extension of the file.
 * @returns A function that takes a data object and returns a string.
 */
async function LoadPage(url: string, isDebug: boolean) {
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

    const compiledPath = path.join(typeArray[1], SplitInfo[1] + '.cjs');
    const private_var = {};

    try {
        const MyModule = await ImportWithoutCache(compiledPath);

        return MyModule(_require, _include, _transfer, private_var, handelConnectorService);
    } catch (e) {
        let errorText: string;

        if(isDebug){
            print.error("Error path -> ", RemoveEndType(url), "->", e.message);
            print.error(e.stack);
            errorText = JSParser.printError(`Error path: ${url}<br/>Error message: ${e.message}`);
        } else {
            errorText = JSParser.printError(`Error code: ${e.code}`)
        }

        return (DataObject: any) => {
            DataObject.Request.error = e;
            DataObject.out_run_script.text += errorText;
        }

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

        const {setResponse, write, writeSafe, echo} = createDateWriter(out_run_script, isDebug);

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
