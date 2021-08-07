import path from 'path';
import EasyFs from '../OutputInput/EasyFs.js';
import { BasicSettings, getTypes, CheckDependencyChange } from './SearchFileSystem.js';
import { FastCompile } from './SearchPages.js';
import { print } from '../OutputInput/Console.js';
import { ImportFile, AddExtension } from '../ImportFiles/Script.js';
import { handelConnectorService } from '../BuildInComponents/index.js';
import ImportWithoutCache from '../ImportFiles/ImportWithoutCache.js';
function SplitFirst(type, string) {
    const index = string.indexOf(type);
    return [string.substring(0, index), string.substring(index + type.length)];
}
function CutTheLast(type, string) {
    return string.substring(0, string.lastIndexOf(type));
}
const Export = {
    PageLoadRam: {},
    PageRam: true
};
const LastRequire = {};
/*
'url': [LoadPage, BuildPage];
*/
const LastRequireFiles = {};
async function RequireFile(p, pathname, typeArray, LastRequire, isDebug) {
    const ReqFile = LastRequire[p];
    const fullPath = ReqFile && typeArray[0] + ReqFile;
    let Exists, Stat;
    if (ReqFile && (!isDebug || (isDebug && (LastRequireFiles[ReqFile].date == -1 || (!(Exists = await EasyFs.exists(fullPath)) && LastRequireFiles[ReqFile].date == 0) || Exists && LastRequireFiles[ReqFile].date == (Stat = await EasyFs.stat(fullPath, 'mtimeMs')))))) {
        return LastRequireFiles[ReqFile].model;
    }
    const copy = p;
    let static_modules = false;
    if (!ReqFile) {
        if (p[0] == '.') {
            if (p[1] == '/') {
                p = p.substring(2);
            }
            p = pathname && (pathname + '/' + p) || p;
        }
        else if (p[0] != '/') {
            static_modules = true;
        }
        else {
            p = p.substring(1);
        }
    }
    else {
        p = ReqFile;
        static_modules = LastRequireFiles[ReqFile].static;
    }
    if (static_modules) {
        LastRequireFiles[p] = { model: await import(p), date: -1, static: true };
        LastRequire[copy] = p;
        return LastRequireFiles[copy].model;
    }
    else {
        // add serv.js or serv.ts if needed
        p = AddExtension(p);
        if (Exists || (Exists === undefined && await EasyFs.exists(typeArray[0] + p))) {
            if (!Stat) {
                Stat = await EasyFs.stat(typeArray[0] + p, 'mtimeMs');
            }
            const ReModel = isDebug && LastRequireFiles[p] && LastRequireFiles[p].date != Stat;
            if (!LastRequireFiles[p] || ReModel) {
                LastRequireFiles[p] = { model: await ImportFile(p, typeArray, isDebug), date: Stat };
            }
            LastRequire[copy] = p;
            return LastRequireFiles[p].model;
        }
    }
    LastRequireFiles[p] = { model: {}, date: 0 };
    LastRequire[copy] = p;
    return LastRequireFiles[p].model;
}
async function RequirePage(p, pathname, typeArray, LastRequire, DataObject) {
    if (LastRequire[p] && (DataObject.isDebug || LastRequire[p].date == -1 && !await EasyFs.exists(LastRequire[p].path))) {
        return await LastRequire[p].model(DataObject);
    }
    const copy = p;
    const extname = path.extname(p).substring(1);
    if (p[0] == '.') {
        if (p[1] == '/') {
            p = p.substring(2);
        }
        else {
            p = p.substring(1);
        }
        p = pathname && (pathname + '/' + p) || p;
    }
    if (![BasicSettings.pageTypes.page, BasicSettings.pageTypes.component].includes(extname)) {
        const importText = await EasyFs.readFile(typeArray[0] + p);
        DataObject.write(importText);
        return importText;
    }
    if (!extname) {
        p += '.' + BasicSettings.pageTypes.page;
    }
    if (!await EasyFs.exists(typeArray[0] + p)) {
        LastRequire[copy] = { model: () => { }, date: -1, path: typeArray[0] + p };
        return LastRequire[copy].model;
    }
    const ForSavePath = typeArray[2] + p.substring(0, p.length - extname.length - 1);
    const re_build = DataObject.isDebug && (!await EasyFs.exists(typeArray[1] + p + '.js') || await CheckDependencyChange(ForSavePath));
    if (re_build) {
        await FastCompile(p.substring(1), typeArray);
    }
    if (Export.PageLoadRam[ForSavePath] && !re_build) {
        LastRequire[copy] = { model: Export.PageLoadRam[ForSavePath][0] };
        return await LastRequire[copy].model(DataObject);
    }
    const func = await LoadPage(ForSavePath, extname);
    if (Export.PageRam) {
        if (!Export.PageLoadRam[ForSavePath]) {
            Export.PageLoadRam[ForSavePath] = [];
        }
        Export.PageLoadRam[ForSavePath][0] = func;
    }
    LastRequire[copy] = { model: func };
    return await func(DataObject);
}
const GlobalVar = {};
function getFullPath(url) {
    return path.resolve() + '/' + BasicSettings.WebSiteFolder + CutTheLast('/', '/' + url);
}
function getFullPathCompile(url) {
    const SplitInfo = SplitFirst('/', url);
    const typeArray = getTypes[SplitInfo[0]];
    return typeArray[1] + SplitInfo[1] + "." + BasicSettings.pageTypes.page + '.js';
}
async function LoadPage(url, ext = BasicSettings.pageTypes.page) {
    const SplitInfo = SplitFirst('/', url);
    const __dirname = getFullPath(url);
    const Debug__filename = url + "." + ext;
    const __filename = __dirname + '/' + url.split('/').pop() + "." + ext;
    const pathname = CutTheLast('/', '/' + SplitInfo[1]);
    const typeArray = getTypes[SplitInfo[0]];
    const LastRequire = {};
    // eslint-disable-next-line prefer-const
    function _require(DataObject, p) {
        return RequireFile(p, pathname, typeArray, LastRequire, DataObject.isDebug);
    }
    function _include(DataObject, p, WithObject = {}) {
        return RequirePage(p, pathname, typeArray, LastRequire, { ...WithObject, ...DataObject });
    }
    const compiledPath = path.join(typeArray[1], SplitInfo[1] + "." + ext + '.js');
    const private_var = {};
    try {
        const MyModule = await ImportWithoutCache(compiledPath, async (compiledPath) => await import('file:///' + compiledPath));
        return MyModule.default(__dirname, __filename, _require, _include, private_var, handelConnectorService);
    }
    catch (e) {
        print.log("Error path -> ", Debug__filename, "->", e.message);
        return (DataObject) => DataObject.out_run_script.text += `<div style="color:red;text-align:left;font-size:16px;"><p>Error path: ${Debug__filename}</p><p>Error message: ${e.message}</p></div>`;
    }
}
function BuildPage(LoadPageFunc, run_script_name) {
    const RequireVar = {};
    return (async function (Response, Request, Post, Query, Cookies, Session, Files, isDebug) {
        const out_run_script = { text: '' };
        function ToStringInfo(str) {
            if (typeof str == 'object') {
                return JSON.stringify(str);
            }
            else {
                return String(str);
            }
        }
        function setResponse(text) {
            out_run_script.text = ToStringInfo(text);
        }
        function write(text = '') {
            out_run_script.text += ToStringInfo(text);
        }
        ;
        function safeWrite(str = '') {
            str = ToStringInfo(str);
            for (const i of str) {
                out_run_script.text += '&#' + i.charCodeAt(0) + ';';
            }
        }
        let redirectPath = false;
        Response.redirect = (path, status) => {
            redirectPath = String(path);
            if (status != null) {
                Response.status(status);
            }
            return Response;
        };
        Response.reload = () => {
            Response.redirect(Request.url);
        };
        function sendFile(filePath, deleteAfter = false) {
            redirectPath = { file: filePath, deleteAfter };
        }
        const DataSend = {
            sendFile,
            safeWrite,
            write,
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
            RequireVar,
            codebase: ''
        };
        await LoadPageFunc(DataSend);
        return { out_run_script: out_run_script.text, redirectPath };
    });
}
export { LoadPage, BuildPage, getFullPathCompile, Export, SplitFirst };
//# sourceMappingURL=FunctionScript.js.map