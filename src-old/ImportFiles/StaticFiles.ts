import path from 'path';
import { BuildJS, BuildJSX, BuildTS, BuildTSX } from './ForStatic/Script';
import BuildSvelte from './ForStatic/Svelte/client';
import { BuildStyleSass } from './ForStatic/Style';
import { getTypes, SystemData, getDirname, BasicSettings, workingDirectory } from '../RunTimeBuild/SearchFileSystem';
import EasyFs from '../OutputInput/EasyFs';
import { Response, Request } from '@tinyhttp/app';
import { GetPlugin } from '../CompileCode/InsertModels';
import fs from 'fs';
import prompts from 'prompts';
import { argv } from 'process';
import StoreJSON from '../OutputInput/StoreJSON';
import { WebsiteAllowBasicExtensions } from './ForStatic/CommonFileExtensions';
import { GlobalSitemapBuilder, onSitemapRequest } from '../CompileCode/XMLHelpers/SitemapBuilder';

const SupportedTypes = ['js', 'svelte', 'ts', 'jsx', 'tsx', 'css', 'sass', 'scss'];
const AllBaseAllowedExtensions = [...WebsiteAllowBasicExtensions, ...SupportedTypes];
const AllBaseIgnoredExtensions = [...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray, ...BasicSettings.pageCodeFileArray];

export const DevAllowWebsiteExtensions = [...AllBaseAllowedExtensions]
export const DevIgnoredWebsiteExtensions = [...AllBaseIgnoredExtensions]

/**
 * Update the allowed file extensions of a static file
 * @param {string[]} extensions - string[] - The extensions to allow.
 */
export function updateDevAllowWebsiteExtensions(extensions: string[]) {
    extensions = [...extensions, ...AllBaseAllowedExtensions].filter(x => !DevIgnoredWebsiteExtensions.includes(x));
    DevAllowWebsiteExtensions.length = 0;
    DevAllowWebsiteExtensions.push(...extensions);
}

/**
 * Update the hidden files extensions that you are not allowed to see.
 * @param {string[]} extensions - string[] - An array of strings that represent the extensions to
 * ignore.
 */
export function updateDevIgnoredWebsiteExtensions(extensions: string[]) {
    DevIgnoredWebsiteExtensions.length = 0;
    DevIgnoredWebsiteExtensions.push(...extensions, ...AllBaseIgnoredExtensions);
}

const StaticFilesInfo = new StoreJSON('StaticFiles');

/**
 * It checks if any of the files that the current file depends on has been modified
 * @param {string} path - The path of the file to check.
 * @returns A boolean value.
 */
async function CheckDependencyChange(path: string) {
    const o = StaticFilesInfo.store[path];

    for (const i in o) {
        let p = i;

        if (i == 'thisFile') {
            p = getTypes.Static[2] + '/' + path;
        }

        const FilePath = BasicSettings.fullWebSitePath + p;
        if (await EasyFs.stat(FilePath, 'mtimeMs', true) != o[i]) {
            return true;
        }
    }

    return !o;
}


/**
 * It compiles a file and update the list of its dependencies
 * @param {string} SmallPath - The path to the file to be compiled.
 * @param {boolean} isDebug - Whether to compile in debug mode.
 * @param {string} [fullCompilePath] - The full path to the compiled file.
 * @returns A boolean.
 */
export default async function BuildFile(SmallPath: string, isDebug: boolean, fullCompilePath?: string) {
    const ext = path.extname(SmallPath).substring(1).toLowerCase();

    let dependencies: { [key: string]: number };
    switch (ext) {
        case 'js':
            dependencies = await BuildJS(SmallPath, isDebug);
            break;
        case 'ts':
            dependencies = await BuildTS(SmallPath, isDebug);
            break;
        case 'jsx':
            dependencies = await BuildJSX(SmallPath, isDebug);
            break;
        case 'tsx':
            dependencies = await BuildTSX(SmallPath, isDebug);
            break;
        case 'css':
        case 'sass':
        case 'scss':
            dependencies = await BuildStyleSass(SmallPath, ext, isDebug);
            break;
        case 'svelte':
            dependencies = await BuildSvelte(SmallPath, isDebug);
            fullCompilePath += '.js';
    }

    if (isDebug && await EasyFs.existsFile(fullCompilePath)) {
        StaticFilesInfo.update(SmallPath, dependencies);
        return true;
    }

    if (!isDebug)
        return true;
}

interface buildIn {
    path?: string;
    ext?: string;
    type: string;
    inServer?: string;
    content?: string;
}

const staticFiles = SystemData + '/../static/client/';
const getStatic: buildIn[] = [{
    path: "serv/temp.js",
    type: "js",
    inServer: staticFiles + "buildTemplate.js"
},
{
    path: "serv/connect.js",
    type: "js",
    inServer: staticFiles + "makeConnection.js"
},
{
    path: "serv/md.js",
    type: "js",
    inServer: staticFiles + "markdownCopy.js"
}];

const getStaticFilesType: buildIn[] = [{
    ext: '.pub.js',
    type: 'js'
},
{
    ext: '.pub.mjs',
    type: 'js'
},
{
    ext: '.pub.css',
    type: 'css'
}];

/**
 * It checks if the file is a server-build and exits on the server, and if it does, it returns the file type and the path
 * to the file
 * @param {Request} Request - The request object from the server.
 * @param {string} filePath - The path to the file that is being requested.
 * @param {boolean} checked - If true, the file will be returned even if it doesn't exist.
 * @returns an object with the properties of the found object and the inServer property.
 */
async function serverBuildByType(Request: Request, filePath: string, checked: boolean) {
    const found = getStaticFilesType.find(x => filePath.endsWith(x.ext));

    if (!found)
        return;


    const basePath = Request.query.t == 'l' ? getTypes.Logs[1] : getTypes.Static[1];
    const inServer = path.join(basePath, filePath);

    if (checked || await EasyFs.existsFile(inServer))
        return { ...found, inServer };
}

let debuggingWithSource: null | boolean = argv.includes('allowSourceDebug') || null;
async function askDebuggingWithSource() {
    if (typeof debuggingWithSource == 'boolean')
        return debuggingWithSource;

    debuggingWithSource = (await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Do you want to allow source debugging?',
        initial: false
    }))?.value;

    return debuggingWithSource;
}

const safeFolders = [getTypes.Static[2], getTypes.Logs[2], getTypes.Models[2], getTypes.Components[2]];
/**
 * If the user is in debug mode, and the file is a source file, and the user commend line argument have allowSourceDebug
 * then return the full path to the file
 * @param {boolean} isDebug - is the current page a debug page?
 * @param {string} filePath - The path of the file that was clicked.
 * @param {boolean} checked - If this path already been checked
 * the file.
 * @returns The type of the file and the path to the file.
 */
async function unsafeDebug(isDebug: boolean, filePath: string, checked: boolean) {
    if (!isDebug || GetPlugin("SafeDebug") || path.extname(filePath) != '.source' || !safeFolders.includes(filePath.split(/\/|\\/).shift()) || !await askDebuggingWithSource())
        return;

    const fullPath = path.join(BasicSettings.fullWebSitePath, filePath.substring(0, filePath.length - 7)); // removing '.source'

    if (checked || await EasyFs.existsFile(fullPath))
        return {
            type: 'html',
            inServer: fullPath
        };
}

/**
 * If the file is a .css file, and it's in the same directory as a .svelte file, then it's a svelte
 * style file
 * @param {string} filePath - The path of the file to be checked.
 * @param {boolean} checked - If true, the function will not check if the file exists.
 * @param {boolean} isDebug - If true, the function will try to build the file if it doesn't exist.
 * @returns A promise that resolves to an object with a type and inServer property.
 */
async function svelteStyle(filePath: string, checked: boolean, isDebug: boolean) {
    const baseFilePath = filePath.substring(0, filePath.length - 4); // removing '.css'
    const fullPath = getTypes.Static[1] + filePath;

    let exists: boolean;
    if (filePath.endsWith('.css') && path.extname(baseFilePath) == '.svelte' && (checked || (exists = await EasyFs.existsFile(fullPath))))
        return {
            type: 'css',
            inServer: fullPath
        }

    if (isDebug && !exists) {
        await BuildFile(baseFilePath, isDebug, getTypes.Static[1] + baseFilePath)
        return svelteStyle(filePath, checked, false);
    }
}

/**
 * If the file is in the `serv/svelte` folder, and it's a JavaScript file, then return the path to the
 * file in the `node_modules` folder
 * @param {string} filePath - The path of the file that is being requested.
 * @param {boolean} checked - If true, the function will be called even if the file doesn't exist.
 * @returns A function that returns a promise that resolves to a file object.
 */
async function svelteStatic(filePath: string, checked: boolean) {
    if (!filePath.startsWith('serv/svelte/'))
        return;

    const fullPath = workingDirectory + 'node_modules' + filePath.substring(4) + (path.extname(filePath) ? '' : '/index.mjs');

    if (checked || await EasyFs.existsFile(fullPath))
        return {
            type: 'js',
            inServer: fullPath
        }
}

/**
 * If the file is a code theme, return a CSS file that's in the server
 * @param {string} filePath - The path of the file that is being requested.
 * @param {boolean} checked - Whether the file is checked or not.
 * @returns A file path to a CSS file.
 */
async function markdownCodeTheme(filePath: string, checked: boolean) {
    if (!filePath.startsWith('serv/md/code-theme/'))
        return;

    const fullPath = workingDirectory + 'node_modules/highlight.js/styles' + filePath.substring(18);

    if (checked || await EasyFs.existsFile(fullPath))
        return {
            type: 'css',
            inServer: fullPath
        }
}

/**
 * It returns a CSS file if it exists in the `node_modules/github-markdown-css` folder
 * @param {string} filePath - The path of the file that is being requested.
 * @param {boolean} checked - Whether the file is checked or not.
 * @returns A file path to a CSS file.
 */
async function markdownTheme(filePath: string, checked: boolean) {
    if (!filePath.startsWith('serv/md/theme/'))
        return;

    let fileName = filePath.substring(14);
    if (fileName.startsWith('auto.'))
        fileName = fileName.substring(4)
    else
        fileName = '-' + fileName;


    const fullPath = workingDirectory + 'node_modules/github-markdown-css/github-markdown' + fileName.replace(/\.css$/, '.min.css');

    if (checked || await EasyFs.existsFile(fullPath))
        return {
            type: 'css',
            inServer: fullPath
        }
}

async function SitemapFile(Request: Request, filePath: string) {
    if (filePath != GlobalSitemapBuilder.location)
        return;

    const fullPath = path.join(getTypes.Static[0], GlobalSitemapBuilder.location);

    const content = await onSitemapRequest(Request);
    if (!content) return; // if the content is null, then the sitemap is not ready yet

    return {
        type: 'xml',
        inServer: fullPath,
        content: content
    }
}


/**
 * It checks if the file is a Svelte component, a Svelte style, a debug file, a file that can be
 * built by type, a markdown theme, a markdown code theme, or a static file
 * @param {Request} Request - The request object from the server.
 * @param {boolean} isDebug - Whether the server is in debug mode.
 * @param {string} path - The path to the file.
 * @param [checked=false] - If the file is already in the cache, it will be true.
 * @returns The first function that returns a value.
 */
export async function serverBuild(Request: Request, isDebug: boolean, path: string, checked = false): Promise<null | buildIn> {
    return await svelteStatic(path, checked) ||
        await svelteStyle(path, checked, isDebug) ||
        await unsafeDebug(isDebug, path, checked) ||
        await serverBuildByType(Request, path, checked) ||
        await markdownTheme(path, checked) ||
        await markdownCodeTheme(path, checked) ||
        getStatic.find(x => x.path == path) ||
        SitemapFile(Request, path);
}

/**
 * > If the file has changed, or any of its dependencies have changed, then rebuild the file
 * @param {string} SmallPath - The path to the file to compile.
 * @param {string} fullCompilePath - The full path to the file that is being compiled.
 * @param {boolean} isDebug - Whether to compile in debug mode.
 * @returns A boolean value.
 */
export async function rebuildFile(SmallPath: string, fullCompilePath: string, isDebug: boolean) {
    return await CheckDependencyChange(SmallPath) && await BuildFile(SmallPath, isDebug, fullCompilePath);
}

/**
 * Check if the path is to special file, and if so, compile it, and return its content on the response.
 * @param {string} SmallPath - The path of the file relative to the static folder.
 * @param {boolean} isDebug - boolean - whether the server is in debug mode or not
 * @param {Request} Request - The request object
 * @param {Response} Response - The response object from express.
 * @returns the file that is being requested.
 */
export async function GetFile(SmallPath: string, isDebug: boolean, Request: Request, Response: Response) {
    // checking if the file is a special file
    const isBuildIn = await serverBuild(Request, isDebug, SmallPath, true);

    if (isBuildIn) {
        Response.type(isBuildIn.type);
        Response.end(isBuildIn.content ?? await EasyFs.readFile(isBuildIn.inServer)); // sending the file content
        return;
    }

    // paths for the file
    const fullCompilePath = getTypes.Static[1] + SmallPath;
    const fullPath = getTypes.Static[0] + SmallPath;

    // checking if the file is a static file
    const ext = path.extname(SmallPath).substring(1).toLowerCase();
    if (!SupportedTypes.includes(ext)) {
        Response.sendFile(fullPath);
        return;
    }

    if (['sass', 'scss', 'css'].includes(ext)) { // adding type
        Response.type('css');
    } else {
        Response.type('js');
    }

    let resPath = fullCompilePath;

    // re-compiling if necessary on debug mode
    if (isDebug && (Request.query.source == 'true' || await CheckDependencyChange(SmallPath) && !await BuildFile(SmallPath, isDebug, fullCompilePath))) {
        resPath = fullPath;
    } else if (ext == 'svelte')
        resPath += '.js';

    Response.end(await fs.promises.readFile(resPath, 'utf8')); // sending the file
}

/**
 * Returns true if the file exists and has an extension that is allowed to be served
 * @param {string} fullPageUrl - The full path to the file.
 * @returns A boolean value.
 */
export async function allowedStaticFile(fullPageUrl: string) {
    const extension = path.extname(fullPageUrl).substring(1).toLowerCase();
    return DevAllowWebsiteExtensions.includes(extension) && await EasyFs.existsFile(fullPageUrl);
}