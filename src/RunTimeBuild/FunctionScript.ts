import path from 'path';
import EasyFs from '../OutputInput/EasyFs';
import { BasicSettings, getTypes, CheckDependencyChange } from './SearchFileSystem';
import { FastCompile } from './SearchPages';
import { print } from '../OutputInput/Console';
import { Request, Response } from '@tinyhttp/app';
import { Files } from 'formidable';
import { handelConnectorService } from '../BuildInComponents/index';
//@ts-ignore-next-line
import ImportWithoutCache from '../ImportFiles/ImportWithoutCache.cjs';
import { CutTheLast, SplitFirst } from '../StringMethods/Splitting';
import RequireFile from './ImportFileRuntime';

const Export = {
    PageLoadRam: {},
    PageRam: true
}

async function RequirePage(filePath: string, pathname: string, typeArray: string[], LastRequire: { [key: string]: any }, DataObject: any) {
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

    if (filePath[0] == '.') {
        if (filePath[1] == '/')
            filePath = filePath.substring(2);
        else
            filePath = filePath.substring(1);

        filePath = pathname && (pathname + '/' + filePath) || filePath;
    }

    const fullPath = typeArray[0] + filePath;

    if (![BasicSettings.pageTypes.page, BasicSettings.pageTypes.component].includes(extname)) {
        const importText = await EasyFs.readFile(fullPath);
        DataObject.write(importText);
        return importText;
    }

    fileExists = fileExists ?? await EasyFs.existsFile(fullPath);
    if (!fileExists) {
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

function getFullPath(url: string) {
    return path.resolve() + '/' + BasicSettings.WebSiteFolder + CutTheLast('/', '/' + url);
}

function getFullPathCompile(url: string) {
    const SplitInfo = SplitFirst('/', url);
    const typeArray = getTypes[SplitInfo[0]];
    return typeArray[1] + SplitInfo[1] + "." + BasicSettings.pageTypes.page + '.cjs';
}

async function LoadPage(url: string, ext = BasicSettings.pageTypes.page) {
    const SplitInfo = SplitFirst('/', url);
    const __dirname = getFullPath(url);
    const Debug__filename = url + "." + ext;
    const __filename = __dirname + '/' + url.split('/').pop() + "." + ext;
    const pathname = CutTheLast('/', '/' + SplitInfo[1]);

    const typeArray = getTypes[SplitInfo[0]];

    const LastRequire = {};

    function _require(DataObject: any, p: string) {
        return RequireFile(p, pathname, typeArray, LastRequire, DataObject.isDebug);
    }

    function _include(DataObject: any, p: string, WithObject = {}) {
        return RequirePage(p, pathname, typeArray, LastRequire, { ...WithObject, ...DataObject });
    }

    const compiledPath = path.join(typeArray[1], SplitInfo[1] + "." + ext + '.cjs');
    const private_var = {};

    try {
        const MyModule = await ImportWithoutCache(compiledPath);

        return MyModule(__dirname, __filename, _require, _include, private_var, handelConnectorService);
    } catch (e) {
        print.error("Error path -> ", Debug__filename, "->", e.message);
        print.error(e.stack);
        return (DataObject: any) => DataObject.out_run_script.text += `<div style="color:red;text-align:left;font-size:16px;"><p>Error path: ${Debug__filename}</p><p>Error message: ${e.message}</p></div>`;
    }
}

function BuildPage(LoadPageFunc: (...data: any[]) => void, run_script_name: string) {
    const RequestVar = {};

    return (async function (Response: Response, Request: Request, Post: { [key: string]: any } | null, Query: { [key: string]: any }, Cookies: { [key: string]: any }, Session: { [key: string]: any }, Files: Files, isDebug: boolean) {
        const out_run_script = { text: '' };

        function ToStringInfo(str: any) {
            const asString = String(str);
            if (asString.startsWith('[object Object]')) {
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

        function echo(arr: string[], params: any[]) {
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
            RequestVar,
            codebase: ''
        }

        await LoadPageFunc(DataSend);

        return { out_run_script: out_run_script.text, redirectPath }
    })
}

export { LoadPage, BuildPage, getFullPathCompile, Export, SplitFirst };