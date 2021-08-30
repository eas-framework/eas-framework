import EasyFs from '../OutputInput/EasyFs.js';
import { print } from '../OutputInput/Console.js';
import { getTypes, BasicSettings, CheckDependencyChange, PagesInfo } from './SearchFileSystem.js';
import { FastCompile as FastCompile } from './SearchPages.js';
import { GetFile as GetStaticFile, serverBuild } from '../ImportFiles/StaticFiles.js';
import * as FuncScript from './FunctionScript.js';
import MakeApiCall from './ApiCall.js';
const { Export } = FuncScript;
const Settings = {
    CacheDays: 1,
    PageRam: false,
    DevMode: true,
    ErrorPages: {}
};
async function LoadPageToRam(url) {
    if (await EasyFs.existsFile(FuncScript.getFullPathCompile(url))) {
        Export.PageLoadRam[url] = [];
        Export.PageLoadRam[url][0] = await FuncScript.LoadPage(url);
        Export.PageLoadRam[url][1] = FuncScript.BuildPage(Export.PageLoadRam[url][0], url);
    }
}
async function LoadAllPagesToRam() {
    for (const i in PagesInfo) {
        if (!ExtensionInArray(i, BasicSettings.ReqFileTypesArray))
            await LoadPageToRam(i);
    }
}
function ClearAllPagesFromRam() {
    for (const i in Export.PageLoadRam) {
        Export.PageLoadRam[i] = undefined;
        delete Export.PageLoadRam[i];
    }
}
function ExtensionInArray(filePath, ...arrays) {
    filePath = filePath.toLowerCase();
    for (const array of arrays) {
        for (const i of array) {
            if (filePath.substring(filePath.length - i.length - 1) == '.' + i)
                return true;
        }
    }
    return false;
}
function isServerFile(filePath) {
    return ExtensionInArray(filePath, BasicSettings.pageTypesArray, BasicSettings.ReqFileTypesArray);
}
function GetErrorPage(code, LocSettings) {
    let arrayType, url;
    if (Settings.ErrorPages[LocSettings]) {
        arrayType = getTypes.Static;
        url = Settings.ErrorPages[LocSettings].path;
        code = Settings.ErrorPages[LocSettings].code ?? code;
    }
    else {
        arrayType = getTypes.Logs;
        url = 'e' + code;
    }
    return { url, arrayType, code };
}
async function ParseBasicInfo(Request, Response, code) {
    //first step - parse info
    if (Request.method == "POST") {
        if (!Request.body || !Object.keys(Request.body).length)
            Request.body = Request.fields || {};
    }
    else
        Request.body = false;
    if (Request.closed)
        return;
    await new Promise(next => Settings.Cookies(Request, Response, next));
    await new Promise(next => Settings.CookieEncrypter(Request, Response, next));
    await new Promise(next => Settings.SessionStore(Request, Response, next));
    Request.signedCookies = Request.signedCookies || {};
    const CopyCookies = JSON.parse(JSON.stringify(Request.signedCookies));
    Request.cookies = Request.signedCookies;
    Response.statusCode = 201;
    //second step
    return () => {
        if (Response.statusCode === 201)
            Response.statusCode = code;
        for (const i in Request.signedCookies) { //update cookies
            if (typeof Request.signedCookies[i] != 'object' && Request.signedCookies[i] != CopyCookies[i] || JSON.stringify(Request.signedCookies[i]) != JSON.stringify(CopyCookies[i]))
                Response.cookie(i, Request.signedCookies[i], Settings.CookieSettings);
        }
        for (const i in CopyCookies) { //delete not exits cookies
            if (Request.signedCookies[i] === undefined)
                Response.clearCookie(i);
        }
    };
}
//final step
async function deleteRequestFiles(Request) {
    if (!Request.files) //delete files
        return;
    for (const i in Request.files) {
        const e = Request.files[i];
        if (Array.isArray(e)) {
            for (const a in e) {
                await EasyFs.unlinkIfExists(e[a].path);
            }
        }
        else
            await EasyFs.unlinkIfExists(e.path);
    }
}
async function isURLPathAFile(Request, url, arrayType, code) {
    let fullPageUrl = arrayType[2];
    let file = false;
    if (code == 200) {
        fullPageUrl = getTypes.Static[0] + url;
        //check that is not server file
        if (await serverBuild(Request, Settings.DevMode, url) || !isServerFile(url) && await EasyFs.existsFile(fullPageUrl))
            file = true;
        else // then it a server page or error page
            fullPageUrl = arrayType[2];
    }
    return { file, fullPageUrl };
}
async function BuildLoadPage(smallPath) {
    const pageArray = [await FuncScript.LoadPage(smallPath)];
    pageArray[1] = FuncScript.BuildPage(pageArray[0], smallPath);
    if (Settings.PageRam)
        Export.PageLoadRam[smallPath] = pageArray;
    return pageArray[1];
}
async function BuildPageURL(arrayType, url, smallPath, code) {
    let fullPageUrl;
    if (!await EasyFs.existsFile(arrayType[0] + url + '.' + BasicSettings.pageTypes.page)) {
        const ErrorPage = GetErrorPage(404, 'NotFound');
        url = ErrorPage.url;
        arrayType = ErrorPage.arrayType;
        code = ErrorPage.code;
        smallPath = arrayType[2] + '/' + url;
        fullPageUrl = url + "." + BasicSettings.pageTypes.page;
        if (!await EasyFs.existsFile(arrayType[0] + fullPageUrl))
            fullPageUrl = null;
        else
            fullPageUrl = arrayType[1] + fullPageUrl + '.cjs';
    }
    else
        fullPageUrl = arrayType[1] + url + "." + BasicSettings.pageTypes.page + '.cjs';
    return {
        arrayType,
        fullPageUrl,
        smallPath,
        code,
        url
    };
}
async function GetDynamicPage(arrayType, url, fullPageUrl, smallPath, code) {
    const SetNewURL = async () => {
        const build = await BuildPageURL(arrayType, url, smallPath, code);
        smallPath = build.smallPath, url = build.url, code = build.code, fullPageUrl = build.fullPageUrl, arrayType = build.arrayType;
        return true;
    };
    let DynamicFunc;
    if (Settings.DevMode && await SetNewURL() && fullPageUrl) {
        if (!await EasyFs.existsFile(fullPageUrl) || await CheckDependencyChange(smallPath)) {
            await FastCompile(url + '.' + BasicSettings.pageTypes.page, arrayType);
            DynamicFunc = await BuildLoadPage(smallPath);
        }
        else if (Export.PageLoadRam[smallPath]) {
            if (!Export.PageLoadRam[smallPath][1]) {
                DynamicFunc = FuncScript.BuildPage(Export.PageLoadRam[smallPath][0], smallPath);
                if (Settings.PageRam)
                    Export.PageLoadRam[smallPath][1] = DynamicFunc;
            }
            else
                DynamicFunc = Export.PageLoadRam[smallPath][1];
        }
        else
            DynamicFunc = await BuildLoadPage(smallPath);
    }
    else if (Export.PageLoadRam[smallPath])
        DynamicFunc = Export.PageLoadRam[smallPath][1];
    else if (!Settings.PageRam && await SetNewURL() && fullPageUrl)
        await BuildLoadPage(smallPath);
    else {
        code = Settings.ErrorPages.NotFound?.code ?? 404;
        const ErrorPage = Settings.ErrorPages.NotFound && Export.PageLoadRam[getTypes.Static[2] + '/' + Settings.ErrorPages.NotFound.path] || Export.PageLoadRam[getTypes.Logs[2] + '/e404'];
        if (ErrorPage)
            DynamicFunc = ErrorPage[1];
        else
            fullPageUrl = null;
    }
    return {
        DynamicFunc,
        code,
        fullPageUrl
    };
}
async function MakePageResponse(DynamicResponse, Response) {
    if (DynamicResponse.redirectPath?.file) {
        Response.sendFile(DynamicResponse.redirectPath.file);
        await new Promise(res => Response.on('finish', res));
    }
    else if (DynamicResponse.redirectPath) {
        Response.writeHead(302, { Location: DynamicResponse.redirectPath });
        Response.end();
    }
    else {
        const ResPage = DynamicResponse.out_run_script.trim();
        if (ResPage) {
            Response.send(ResPage);
        }
        else {
            Response.end();
        }
    }
    if (DynamicResponse.redirectPath.deleteAfter) {
        await EasyFs.unlinkIfExists(Response.redirectPath.file);
    }
}
async function ActivatePage(Request, Response, arrayType, url, FileInfo, code, nextPrase) {
    const { DynamicFunc, fullPageUrl, code: newCode } = await GetDynamicPage(arrayType, url, FileInfo.fullPageUrl, FileInfo.fullPageUrl + '/' + url, code);
    if (!fullPageUrl)
        return Response.sendStatus(newCode);
    try {
        await nextPrase();
        await MakePageResponse(await DynamicFunc(Response, Request, Request.body, Request.query, Request.signedCookies, Request.session, Request.files || {}, Settings.DevMode), Response);
    }
    catch (e) {
        print.error(e);
        Request.error = e;
        const ErrorPage = GetErrorPage(500, 'ServerError');
        DynamicPage(Request, Response, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
        return false;
    }
    return true;
}
async function DynamicPage(Request, Response, url, arrayType = getTypes.Static, code = 200) {
    const FileInfo = await isURLPathAFile(Request, url, arrayType, code);
    if (FileInfo.file) {
        Response.setHeader("Cache-Control", "max-age=" + (Settings.CacheDays * 24 * 60 * 60));
        await GetStaticFile(url, Settings.DevMode, Request, Response);
        deleteRequestFiles(Request);
        return;
    }
    let frameworkStep;
    const nextPrase = async () => !frameworkStep && (frameworkStep = await ParseBasicInfo(Request, Request, code)); // parse data from methods - post, get... + cookies, session...
    const isApi = await MakeApiCall(Request, Response, url, Settings.DevMode, nextPrase);
    if (!isApi && !await ActivatePage(Request, Response, arrayType, url, FileInfo, code, nextPrase))
        return;
    frameworkStep(); // save cookies + code
    deleteRequestFiles(Request); // delete files
}
function urlFix(url) {
    url = url.substring(0, url.lastIndexOf('?')) || url;
    if (url == '/') {
        url = '/index';
    }
    return decodeURIComponent(url);
}
export { Settings, DynamicPage, LoadAllPagesToRam, ClearAllPagesFromRam, urlFix, GetErrorPage };
