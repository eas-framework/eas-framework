import fs, {Dirent} from 'fs';
import EasyFs from '../OutputInput/EasyFs';
import {cwd} from 'process';
import path from 'path';
import {URL} from 'url'

function getDirname(url: string){
    return path.dirname(new URL(url).pathname);
}

const SystemData = getDirname(import.meta.url) + '/../SystemData';

const PagesInfoPath = SystemData + '/PagesInfo.json';

let WebSiteFolder_ = "WebSite";

const StaticName = 'WWW', LogsName = 'Logs';

const StaticCompile = SystemData + `/${StaticName}Compile/`;
const CompileLogs = SystemData + `/${LogsName}Compile/`;

const workingDirectory = cwd() + '/';

function GetFullWebSitePath() {
    return workingDirectory + WebSiteFolder_+ '/';
}
let fullWebSitePath_ = GetFullWebSitePath();

function GetSource(name) {
    return  GetFullWebSitePath() + name + '/'
}

const getTypes = {
    Static: [
        GetSource(StaticName),
        StaticCompile,
        StaticName
    ],
    Logs: [
        GetSource(LogsName),
        CompileLogs,
        LogsName
    ],
    get [StaticName](){
        return getTypes.Static;
    }
}

const BasicSettings = {
    pageTypes: {
        page: "page",
        model: "mode",
        component: "inte"
    },
    pageTypesArray: [],

    ReqFileTypes: {
        js: "serv.js",
        ts: "serv.ts",
        'api-ts': "api.js",
        'api-js': "api.ts"
    },
    ReqFileTypesArray: [],

    get WebSiteFolder() {
        return WebSiteFolder_;
    },
    get fullWebSitePath() {
        return fullWebSitePath_;
    },
    set WebSiteFolder(value) {
        WebSiteFolder_ = value;

        fullWebSitePath_ = GetFullWebSitePath();
        getTypes.Static[0] = GetSource(StaticName);
        getTypes.Logs[0] = GetSource(LogsName);
    },
    get tsConfig(){
        return fullWebSitePath_ + 'tsconfig.json'; 
    },
    async tsConfigFile() {
        if(await EasyFs.existsFile(this.tsConfig)){
            return await EasyFs.readFile(this.tsConfig);
        }
    }
}

BasicSettings.pageTypesArray = Object.values(BasicSettings.pageTypes);
BasicSettings.ReqFileTypesArray = Object.values(BasicSettings.ReqFileTypes);

async function filesInDirectory(path, output, pathMore = "") {
    const allInFolder = await EasyFs.readdir(path + pathMore, { withFileTypes: true });
    for (const i of (<Dirent[]>allInFolder)) {
        const n = i.name;
        if (i.isDirectory()) {
            const dir = pathMore + n + '/';
            await filesInDirectory(path, output, dir);
        }
        else {
            output(pathMore, n);
        }
    }
}

async function DeleteInDirectory(path) {
    const allInFolder = await EasyFs.readdir(path, { withFileTypes: true });
    for (const i of (<Dirent[]>allInFolder)) {
        const n = i.name;
        if (i.isDirectory()) {
            const dir = path + n + '/';
            await DeleteInDirectory(dir);
            await EasyFs.rmdir(dir);
        }
        else {
            await EasyFs.unlink(path + n);
        }
    }
}

const PagesInfo = JSON.parse(fs.readFileSync(PagesInfoPath, 'utf8') || '{}');

async function UpdatePageDependency(path:string, o:any) {
    PagesInfo[path] = o;
    await EasyFs.writeFile(PagesInfoPath, JSON.stringify(PagesInfo));
}

function ClearPagesDependency() {
    for (const i in PagesInfo) {
        PagesInfo[i] = undefined;
        delete PagesInfo[i];
    }
}

async function CheckDependencyChange(path:string) {
    const o = PagesInfo[path];

    for (const i in o) {
        let p = i;

        if (i == 'thisPage') {
            p = path + "." + BasicSettings.pageTypes.page;
        }

        const FilePath = fullWebSitePath_  + p;
        if (await EasyFs.stat(FilePath, 'mtimeMs', true) != o[i]) {
            return true;
        }
    }
    return !o;
}

export {
    getDirname,
    SystemData,
    workingDirectory,
    filesInDirectory,
    DeleteInDirectory,
    getTypes,
    BasicSettings,
    PagesInfo,
    ClearPagesDependency,
    UpdatePageDependency,
    CheckDependencyChange
}