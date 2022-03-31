import EasyFs from '../OutputInput/EasyFs';
import { print } from '../OutputInput/Console';
import { getTypes, BasicSettings } from './SearchFileSystem';
import { FastCompile as FastCompile } from './SearchPages';
import { GetFile as GetStaticFile, serverBuild } from '../ImportFiles/StaticFiles';
import { Request, Response } from '@tinyhttp/app';
import * as FuncScript from './FunctionScript';
import MakeApiCall from './ApiCall';
import { CheckDependencyChange, pageDeps } from '../OutputInput/StoreDeps';
const { Export } = FuncScript;

export interface ErrorPages {
    notFound?: {
        path: string,
        code?: number
    },
    serverError?: {
        path: string,
        code?: number
    }
}

interface GetPagesSettings {
    CacheDays: number,
    DevMode: boolean,
    CookieSettings?: any,
    Cookies?: (...args: any[]) => Promise<any>,
    CookieEncrypter?: (...args: any[]) => Promise<any>,
    SessionStore?: (...args: any[]) => Promise<any>,
    ErrorPages: ErrorPages
}

const Settings: GetPagesSettings = {
    CacheDays: 1,
    DevMode: true,
    ErrorPages: {}
}

async function LoadPageToRam(url: string, isDebug: boolean) {
    if (await EasyFs.existsFile(FuncScript.getFullPathCompile(url))) {
        Export.PageLoadRam[url] = [];
        Export.PageLoadRam[url][0] = await FuncScript.LoadPage(url, isDebug);
        Export.PageLoadRam[url][1] = FuncScript.BuildPage(Export.PageLoadRam[url][0], url);
    }
}

async function LoadAllPagesToRam(isDebug: boolean) {
    for (const i in pageDeps.store) {
        if (!ExtensionInArray(i, <any>BasicSettings.ReqFileTypesArray))
            await LoadPageToRam(i, isDebug);

    }
}

function ClearAllPagesFromRam() {
    for (const i in Export.PageLoadRam) {
        Export.PageLoadRam[i] = undefined;
        delete Export.PageLoadRam[i];
    }
}

function ExtensionInArray(filePath: string, ...arrays: string[]) {
    filePath = filePath.toLowerCase();
    for (const array of arrays) {
        for (const i of array) {
            if (filePath.substring(filePath.length - i.length - 1) == '.' + i)
                return true;

        }
    }
    return false;
}

function GetErrorPage(code: number, LocSettings: 'notFound' | 'serverError') {
    let arrayType: string[], url: string;
    if (Settings.ErrorPages[LocSettings]) {
        arrayType = getTypes.Static;
        url = Settings.ErrorPages[LocSettings].path;
        code = Settings.ErrorPages[LocSettings].code ?? code;
    } else {
        arrayType = getTypes.Logs;
        url = 'e' + code;
    }
    return { url, arrayType, code }
}

async function ParseBasicInfo(Request: Request | any, Response: Response, code: number) {
    //first step - parse info
    if (Request.method == "POST") {
        if (!Request.body || !Object.keys(Request.body).length)
            Request.body = Request.fields || {};

    } else
        Request.body = false;


    if (Request.closed)
        return;


    await new Promise(next => Settings.Cookies(Request, Response, next));
    await new Promise(next => Settings.CookieEncrypter(Request, Response, next));
    await new Promise(next => Settings.SessionStore(Request, Response, next));

    Request.signedCookies = Request.signedCookies || {};
    Request.files = Request.files || {};

    const CopyCookies = JSON.parse(JSON.stringify(Request.signedCookies));

    Response.statusCode = 201;

    //second step
    return () => {
        if (Response.statusCode === 201)
            Response.statusCode = code;


        for (const i in Request.signedCookies) {//update cookies
            if (typeof Request.signedCookies[i] != 'object' && Request.signedCookies[i] != CopyCookies[i] || JSON.stringify(Request.signedCookies[i]) != JSON.stringify(CopyCookies[i]))
                Response.cookie(i, Request.signedCookies[i], Settings.CookieSettings);

        }

        for (const i in CopyCookies) {//delete not exits cookies
            if (Request.signedCookies[i] === undefined)
                Response.clearCookie(i);

        }
    }
}

//for final step
function makeDeleteRequestFilesArray(Request: Request | any) {
    if (!Request.files) //delete files
        return []

    const arrPath = []

    for (const i in Request.files) {

        const e = Request.files[i];
        if (Array.isArray(e)) {
            for (const a in e) {
                arrPath.push(e[a].filepath);
            }
        } else
            arrPath.push(e.filepath);

    }

    return arrPath;
}

//final step
async function deleteRequestFiles(array: string[]) {
    for (const e in array)
        await EasyFs.unlinkIfExists(e);
}

async function isURLPathAFile(Request: Request | any, url: string, code: number) {
    if (code == 200) {
        const fullPageUrl = getTypes.Static[0] + url;
        //check that is not server file
        if (await serverBuild(Request, Settings.DevMode, url) || await EasyFs.existsFile(fullPageUrl))
            return fullPageUrl;
    }
}

async function BuildLoadPage(smallPath: string, firstFunc?: any) {
    const pageArray = [firstFunc ?? await FuncScript.LoadPage(smallPath, Settings.DevMode)];

    pageArray[1] = FuncScript.BuildPage(pageArray[0], smallPath);

    if (Export.PageRam)
        Export.PageLoadRam[smallPath] = pageArray;

    return pageArray[1];
}

/**
 * This function is used to load the dynamic page
 * @param {string[]} arrayType - The array of types that the page is.
 * @param {string} url - The url that was requested.
 * @param {string} fullPageUrl - The full path to the page.
 * @param {string} smallPath - The path to the page file.
 * @param {number} code - The status code of the page.
 * @returns The DynamicFunc is the function that will be called to generate the page.
 * The code is the status code that will be returned.
 * The fullPageUrl is the full path to the page.
 */
async function GetDynamicPage(arrayType: string[], url: string, code: number) {
    const inStatic = url + '.' + BasicSettings.pageTypes.page;
    const smallPath = arrayType[2] + '/' + inStatic;
    let fullPageUrl = BasicSettings.fullWebSitePath + smallPath;

    let DynamicFunc: (...data: any[]) => any;
    if (Settings.DevMode && await EasyFs.existsFile(fullPageUrl)) {

        if (!await EasyFs.existsFile(arrayType[1] + inStatic + '.cjs') || await CheckDependencyChange(smallPath)) {
            await FastCompile(url + '.' + BasicSettings.pageTypes.page, arrayType);
            DynamicFunc = await BuildLoadPage(smallPath);

        } else if (Export.PageLoadRam[smallPath]?.[1])
            DynamicFunc = Export.PageLoadRam[smallPath][1];

        else
            DynamicFunc = await BuildLoadPage(smallPath, Export.PageLoadRam[smallPath]?.[0]);

    } else if (Export.PageLoadRam[smallPath]?.[1])
        DynamicFunc = Export.PageLoadRam[smallPath][1];

    else if (!Export.PageRam && await EasyFs.existsFile(fullPageUrl))
        DynamicFunc = await BuildLoadPage(smallPath, Export.PageLoadRam[smallPath]?.[0]);

    else if (arrayType != getTypes.Logs) {
        const { arrayType, code, url } = GetErrorPage(404, 'notFound');
        return GetDynamicPage(arrayType, url, code)
    } else {
        fullPageUrl = null;
    }

    return {
        DynamicFunc,
        code,
        fullPageUrl
    }
}

async function MakePageResponse(DynamicResponse: any, Response: Response | any) {
    if (DynamicResponse.redirectPath?.file) {
        Response.sendFile(DynamicResponse.redirectPath.file);
        await new Promise(res => Response.on('finish', res));
    } else if (DynamicResponse.redirectPath) {
        Response.writeHead(302, { Location: DynamicResponse.redirectPath });
        Response.end();
    } else {
        const ResPage = DynamicResponse.out_run_script.trim();
        if (ResPage) {
            Response.send(ResPage);
        } else {
            Response.end();
        }
    }

    if (DynamicResponse.redirectPath.deleteAfter) {
        await EasyFs.unlinkIfExists(Response.redirectPath.file);
    }
}

/**
 * The function is called when a request is made to a page. 
 * It will check if the page exists, and if it does, it will return the page. 
 * If it does not exist, it will return a 404 page
 * @param {Request | any} Request - The request object.
 * @param {Response} Response - The response object.
 * @param {string[]} arrayType - an array of strings that contains the paths
 * loaded.
 * @param {string} url - The url of the page that was requested.
 * @param {{ file: boolean, fullPageUrl: string }} FileInfo - the file info of the page that is being activated.
 * @param {number} code - number
 * @param nextPrase - A function that returns a promise. This function is called after the dynamic page
 * is loaded.
 * @returns Nothing.
 */
async function ActivatePage(Request: Request | any, Response: Response, arrayType: string[], url: string, code: number, nextPrase: () => Promise<any>) {
    const { DynamicFunc, fullPageUrl, code: newCode } = await GetDynamicPage(arrayType, url, code);

    if (!fullPageUrl || !DynamicFunc && code == 500)
        return Response.sendStatus(newCode);

    try {
        const finalStep = await nextPrase(); // parse data from methods - post, get... + cookies, session...
        const pageData = await DynamicFunc(Response, Request, Request.body, Request.query, Request.cookies, Request.session, Request.files, Settings.DevMode);
        finalStep(); // save cookies + code

        await MakePageResponse(
            pageData,
            Response,
        );
    } catch (e) {

        print.error(e);
        Request.error = e;

        const ErrorPage = GetErrorPage(500, 'serverError');

        DynamicPage(Request, Response, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
        return false;
    }

    return true;
}

async function DynamicPage(Request: Request | any, Response: Response | any, url: string, arrayType = getTypes.Static, code = 200) {
    const FileInfo = await isURLPathAFile(Request, url, code);

    const makeDeleteArray = makeDeleteRequestFilesArray(Request)

    if (FileInfo) {
        Settings.CacheDays && Response.setHeader("Cache-Control", "max-age=" + (Settings.CacheDays * 24 * 60 * 60));
        await GetStaticFile(url, Settings.DevMode, Request, Response);
        deleteRequestFiles(makeDeleteArray);
        return;
    }

    const nextPrase = () => ParseBasicInfo(Request, Response, code); // parse data from methods - post, get... + cookies, session...

    const isApi = await MakeApiCall(Request, Response, url, Settings.DevMode, nextPrase);
    if (!isApi && !await ActivatePage(Request, Response, arrayType, url, code, nextPrase))
        return;

    deleteRequestFiles(makeDeleteArray); // delete files
}

function urlFix(url: string) {
    if (url == '/') {
        url = '/index';
    }

    return decodeURIComponent(url);
}

export {
    Settings,
    DynamicPage,
    LoadAllPagesToRam,
    ClearAllPagesFromRam,
    urlFix,
    GetErrorPage
}