import path from 'path';
import { BuildJS, BuildJSX, BuildTS, BuildTSX } from './ForStatic/Script.js';
import { BuildStyleSass } from './ForStatic/Style.js';
import { getTypes, SystemData, getDirname, BasicSettings } from '../RunTimeBuild/SearchFileSystem.js';
import EasyFs from '../OutputInput/EasyFs.js';
import { GetPlugin } from '../CompileCode/InsertModels.js';
import fs from 'fs';
import promptly from 'promptly';
const SupportedTypes = ['js', 'ts', 'jsx', 'tsx', 'css', 'sass', 'scss'];
const locStaticFiles = SystemData + '/StaticFiles.json';
const StaticFiles = JSON.parse(fs.readFileSync(locStaticFiles, 'utf8') || '{}');
function updateDep(path, deps) {
    StaticFiles[path] = deps;
    EasyFs.writeJsonFile(locStaticFiles, StaticFiles);
}
async function CheckDependencyChange(path) {
    const o = StaticFiles[path];
    for (const i in o) {
        let p = i;
        if (i == 'thisFile') {
            p = path;
        }
        const FilePath = BasicSettings.fullWebSitePath + getTypes.Static[2] + '/' + p;
        if (!await EasyFs.exists(FilePath) || await EasyFs.stat(FilePath, 'mtimeMs') != o[i]) {
            return true;
        }
    }
    return !o;
}
export default async function BuildFile(SmallPath, isDebug, fullCompilePath) {
    const ext = path.extname(SmallPath).substring(1).toLowerCase();
    let dependencies;
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
    }
    if (isDebug && await EasyFs.exists(fullCompilePath)) {
        updateDep(SmallPath, dependencies);
        return true;
    }
    if (!isDebug)
        return true;
}
const getStatic = [{
        path: "serv/temp.js",
        type: "js",
        inServer: "client/buildTemplate.js"
    },
    {
        path: "serv/connect.js",
        type: "js",
        inServer: "client/makeConnection.js"
    }];
const __dirname = getDirname(import.meta.url);
getStatic.forEach(x => x.inServer = __dirname + '/' + x.inServer); // make full path
const getStaticFilesType = [{
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
async function serverBuildByType(filePath, checked) {
    const found = getStaticFilesType.find(x => filePath.endsWith(x.ext));
    if (!found)
        return;
    const inServer = path.join(getTypes.Static[1], filePath);
    if (checked || await EasyFs.exists(inServer))
        return { ...found, inServer };
}
let debuggingWithSource = null;
async function askDebuggingWithSource() {
    if (typeof debuggingWithSource == 'boolean')
        return debuggingWithSource;
    debuggingWithSource = (await promptly.prompt('Allow debugging JavaScript/CSS in source page? - exposing your source code (no)', {
        validator(v) {
            if (['yes', 'no'].includes(v.trim().toLowerCase()))
                return v;
            throw new Error('yes or no');
        },
        timeout: 1000 * 30
    })).trim().toLowerCase() == 'yes';
    return debuggingWithSource;
}
const safeFolders = [getTypes.Static[2], getTypes.Logs[2], 'Models', 'Components'];
async function unsafeDebug(filePath, checked) {
    if (!await askDebuggingWithSource() || GetPlugin("SafeDebug") || path.extname(filePath) != '.source' || !safeFolders.includes(filePath.split(/\/|\\/).shift()))
        return;
    const fullPath = path.join(BasicSettings.fullWebSitePath, filePath.substring(0, filePath.length - 7)); // removing '.source'
    if (checked || await EasyFs.exists(fullPath))
        return {
            type: 'html',
            inServer: fullPath
        };
}
export async function serverBuild(path, checked = false) {
    return await unsafeDebug(path, checked) || await serverBuildByType(path, checked) || getStatic.find(x => x.path == path);
}
export async function GetFile(SmallPath, isDebug, Request, Response) {
    //file built in
    const isBuildIn = await serverBuild(SmallPath, true);
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
    }
    else {
        Response.type('js');
    }
    let resPath = fullCompilePath;
    if (isDebug) { // re-compiling if necessary on debug mode
        if (Request.query.source == 'true') {
            resPath = fullPath;
        }
        else if (await CheckDependencyChange(SmallPath)) {
            if (!await BuildFile(SmallPath, isDebug, fullCompilePath)) {
                resPath = fullPath;
            }
        }
    }
    Response.end(await fs.promises.readFile(resPath, 'utf8')); // sending the file
}
//# sourceMappingURL=StaticFiles.js.map