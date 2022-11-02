import path from "node:path";
import {cwd} from "node:process";
import {fileURLToPath} from "node:url";

const StaticName = 'static', StaticSourceDirectory = 'src';
const ModulesName = 'node_modules', ModuleSourceDirectory = 'node_modules';
const CompileDirectory = '-compile';

function dirname(url: string) {
    return path.dirname(fileURLToPath(url));
}

export const SystemData = path.join(dirname(import.meta.url), '..', 'SystemData');
export const workingDirectory = cwd();

export const ScriptExtension = {
    pages: {
        page: 'page',
        model: 'model',
        component: 'comp',
    },
    get pagesArray(): string[] {
        return Object.values(this.pages);
    },
    get SSRExtensions(){
        return [this.pages.page, this.pages.component];
    },
    get pagesCodeFilesArray() {
        return this.pagesArray.map(ext => [`${ext}.ts`, `${ext}.js`]).flat();
    },
    partExtensions: ['hide', 'api'],
    script: {
        get js() {
            return ScriptExtension.partExtensions[0] + '.js';
        },
        get ts() {
            return ScriptExtension.partExtensions[0] + '.ts';
        },
        get 'api-ts'() {
            return ScriptExtension.partExtensions[1] + '.ts';
        },
        get 'api-js'() {
            return ScriptExtension.partExtensions[1] + '.js';
        }
    },
    scriptArray() {
        return Object.values(this.script);
    }
};

export type LocateDir = {
    source: string
    compile: string
    virtualName: string,
    dirName: string
}

type Directories = {
    fullWebsiteDirectory: string
    Locate: {
        static: LocateDir,
        node_modules: LocateDir
    }
}

export const directories: Directories = {
    fullWebsiteDirectory: null,
    Locate: {
        static: null,
        node_modules: null
    }
};

export function setDirectories(directory: string) {
    const fullWebsiteDirectory = path.isAbsolute(directory) ?
        directory :
        path.join(workingDirectory, directory);
    directories.fullWebsiteDirectory = fullWebsiteDirectory;

    function GetSource(name: string) {
        return path.join(fullWebsiteDirectory, name);
    }

    function GetCompile(name: string) {
        return path.join(SystemData, name + CompileDirectory);
    }

    directories.Locate.static = {
        source: GetSource(StaticSourceDirectory),
        compile: GetCompile(StaticName),
        virtualName: StaticName,
        dirName: StaticSourceDirectory
    };

    directories.Locate.node_modules = {
        source: GetSource(ModuleSourceDirectory),
        compile: GetCompile(ModulesName),
        virtualName: ModulesName,
        dirName: ModulesName
    };
}

export function relative(fullPath: string) {
    return path.relative(directories.fullWebsiteDirectory, fullPath);
}