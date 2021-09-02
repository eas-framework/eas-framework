import path from 'path';
import { BuildJS, BuildJSX, BuildTS, BuildTSX } from './ForStatic/Script';
import BuildSvelte from './ForStatic/Svelte';
import { BuildStyleSass } from './ForStatic/Style';
import { getTypes, SystemData, getDirname, BasicSettings, workingDirectory } from '../RunTimeBuild/SearchFileSystem';
import EasyFs from '../OutputInput/EasyFs';
import { Response, Request } from '@tinyhttp/app';
import { GetPlugin } from '../CompileCode/InsertModels';
import fs from 'fs';
import promptly from 'promptly';

const SupportedTypes = ['js', 'svelte', 'ts', 'jsx', 'tsx', 'css', 'sass', 'scss'];

const locStaticFiles = SystemData + '/StaticFiles.json';

const StaticFiles = JSON.parse(fs.readFileSync(locStaticFiles, 'utf8') || '{}');

function updateDep(path: string, deps: { [key: string]: number }) {
    StaticFiles[path] = deps;
    EasyFs.writeJsonFile(locStaticFiles, StaticFiles);
}

async function CheckDependencyChange(path: string) {
    const o = StaticFiles[path];

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
        updateDep(SmallPath, dependencies);
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
}
const __dirname = getDirname(import.meta.url);

const getStatic: buildIn[] = [{
    path: "serv/temp.js",
    type: "js",
    inServer: __dirname + "/client/buildTemplate.js"
},
{
    path: "serv/connect.js",
    type: "js",
    inServer: __dirname + "/client/makeConnection.js"
}];

const getStaticFilesType: buildIn[] = [{
    ext: '.pub.js',
    type: 'js'
},
{
    ext: '.pub.module.js',
    type: 'js'
},
{
    ext: '.pub.css',
    type: 'css'
}];

async function serverBuildByType(Request: Request, filePath: string, checked: boolean) {
    const found = getStaticFilesType.find(x => filePath.endsWith(x.ext));

    if (!found)
        return;


    const basePath = Request.query.t == 'l' ? getTypes.Logs[1] : getTypes.Static[1];
    const inServer = path.join(basePath, filePath);

    if (checked || await EasyFs.existsFile(inServer))
        return { ...found, inServer };
}

let debuggingWithSource: null | boolean = null;
async function askDebuggingWithSource() {
    if (typeof debuggingWithSource == 'boolean')
        return debuggingWithSource;

    debuggingWithSource = (await promptly.prompt(
        'Allow debugging JavaScript/CSS in source page? - exposing your source code (no)',
        {
            validator(v: string) {
                if (['yes', 'no'].includes(v.trim().toLowerCase()))
                    return v;
                throw new Error('yes or no');
            },
            timeout: 1000 * 30
        }
    )).trim().toLowerCase() == 'yes';

    return debuggingWithSource;
}

const safeFolders = [getTypes.Static[2], getTypes.Logs[2], 'Models', 'Components'];
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

async function svelteStyle(filePath: string, checked: boolean, isDebug: boolean) {
    const baseFilePath = filePath.substring(0, filePath.length - 4); // removing '.css'
    const fullPath = getTypes.Static[1] + filePath;

    if (path.extname(baseFilePath) == '.svelte' && (checked || await EasyFs.existsFile(fullPath)))
        return {
            type: 'css',
            inServer: fullPath
        }

    if (isDebug) {
        await BuildFile(baseFilePath, isDebug, getTypes.Static[1] + baseFilePath);
        return svelteStyle(filePath, checked, false);
    }
}

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

export async function serverBuild(Request: Request, isDebug: boolean, path: string, checked = false): Promise<null | buildIn> {
    return await svelteStatic(path, checked) ||
        await svelteStyle(path, checked, isDebug) ||
        await unsafeDebug(isDebug, path, checked) ||
        await serverBuildByType(Request, path, checked) ||
        getStatic.find(x => x.path == path);
}

export async function rebuildFile(SmallPath: string, fullCompilePath: string, isDebug: boolean) {
    return await CheckDependencyChange(SmallPath) && await BuildFile(SmallPath, isDebug, fullCompilePath);
}

export async function GetFile(SmallPath: string, isDebug: boolean, Request: Request, Response: Response) {
    //file built in
    const isBuildIn = await serverBuild(Request, isDebug, SmallPath, true);

    if (isBuildIn) {
        Response.type(isBuildIn.type);
        Response.end(await EasyFs.readFile(isBuildIn.inServer)); // sending the file
        return;
    }

    //compiled files
    const fullCompilePath = getTypes.Static[1] + SmallPath;
    const fullPath = getTypes.Static[0] + SmallPath;

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
    } else if(ext == 'svelte')
        resPath += '.js';

    Response.end(await fs.promises.readFile(resPath, 'utf8')); // sending the file
}