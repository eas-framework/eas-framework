import path from 'path';
import { BuildJS, BuildJSX, BuildTS, BuildTSX } from './ForStatic/Script';
import { BuildStyleSass } from './ForStatic/Style';
import { getTypes, SystemData,  BasicSettings, getDirname} from '../RunTimeBuild/SearchFileSystem';
import EasyFs from '../OutputInput/EasyFs';
import { Response, Request } from '@tinyhttp/app';
import fs from 'fs';

const SupportedTypes = ['js', 'ts', 'jsx', 'tsx', 'css', 'sass', 'scss'];

const locStaticFiles = SystemData + '/StaticFiles.json';

const StaticFiles = JSON.parse(fs.readFileSync(locStaticFiles, 'utf8') || '{}');

function updateDep(path: string, deps: { [key: string]: number }) {
    StaticFiles[path] = deps;
    EasyFs.writeJsonFile(locStaticFiles, StaticFiles);
}

async function CheckDependencyChange(path:string) {
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
    }

    if (isDebug && !await EasyFs.exists(fullCompilePath)) {
        updateDep(SmallPath, dependencies);
        return true;
    }

    if (!isDebug)
        return true;
}

interface buildIn {
    path: string;
    type: string;
    inServer: string;
}

const getStatic: buildIn[] = [{
    path: "serv/temp.js",
    type: "js",
    inServer: "client/buildTemplate.js"
},
{
    path: "serv/connect.js",
    type: "js",
    inServer: "client/makeConnection.js"
}];

export function serverBuild(path: string): null | buildIn{
    return getStatic.find(x => x.path == path);
}

const __dirname = getDirname(import.meta.url);

export async function GetFile(SmallPath: string, isDebug: boolean, Request: Request, Response: Response) {
    //file built in
    const isBuildIn = serverBuild(SmallPath);

    if(isBuildIn){
        Response.type(isBuildIn.type);
        Response.end(await EasyFs.readFile(__dirname + '/' + isBuildIn.inServer)); // sending the file
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

    if (isDebug) { // re-compiling if necessary on debug mode
        if (Request.query.source == 'true') {
            resPath = fullPath;
        } else if(await CheckDependencyChange(SmallPath)) {

            if(!await BuildFile(SmallPath, isDebug, fullCompilePath)){
                resPath = fullPath;
            }
        }
    }

    Response.end(await fs.promises.readFile(resPath, 'utf8')); // sending the file
}