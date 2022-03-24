import {Dirent} from 'fs';
import EasyFs from '../OutputInput/EasyFs';
import {cwd} from 'process';
import path from 'path';
import {fileURLToPath} from 'url'
import { CutTheLast , SplitFirst} from '../StringMethods/Splitting';

function getDirname(url: string){
    return path.dirname(fileURLToPath(url));
}

const SystemData = path.join(getDirname(import.meta.url), '/SystemData');

let WebSiteFolder_ = "WebSite";

const StaticName = 'WWW', LogsName = 'Logs', ModulesName = 'node_modules';

const StaticCompile = SystemData + `/${StaticName}Compile/`;
const CompileLogs = SystemData + `/${LogsName}Compile/`;
const CompileModule = SystemData + `/${ModulesName}Compile/`;

const workingDirectory = cwd() + '/';

function GetFullWebSitePath() {
    return path.join(workingDirectory,WebSiteFolder_, '/');
}
let fullWebSitePath_ = GetFullWebSitePath();

function GetSource(name) {
    return  GetFullWebSitePath() + name + '/'
}

/* A object that contains all the paths of the files in the project. */
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
    node_modules: [
        GetSource('node_modules'),
        CompileModule,
        ModulesName
    ],
    get [StaticName](){
        return getTypes.Static;
    }
}

const pageTypes = {
    page: "page",
    model: "mode",
    component: "inte"
}


const BasicSettings = {
    pageTypes,

    pageTypesArray: [],

    pageCodeFile: {
        page: [pageTypes.page+".js", pageTypes.page+".ts"],
        model: [pageTypes.model+".js", pageTypes.model+".ts"],
        component: [pageTypes.component+".js", pageTypes.component+".ts"]
    },

    pageCodeFileArray: [],

    partExtensions: ['serv', 'api'],

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
    },
    relative(fullPath: string){
        return path.relative(fullWebSitePath_, fullPath)
    }
}

BasicSettings.pageTypesArray = Object.values(BasicSettings.pageTypes);
BasicSettings.pageCodeFileArray = Object.values(BasicSettings.pageCodeFile).flat();
BasicSettings.ReqFileTypesArray = Object.values(BasicSettings.ReqFileTypes);

export async function DeleteInDirectory(path) {
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

export function smallPathToPage(smallPath: string){
    return CutTheLast('.', SplitFirst('/', smallPath).pop());
}

export function getTypeBySmallPath(smallPath: string){
    return getTypes[SplitFirst('/', smallPath).shift()];
}



export {
    getDirname,
    SystemData,
    workingDirectory,
    getTypes,
    BasicSettings
}