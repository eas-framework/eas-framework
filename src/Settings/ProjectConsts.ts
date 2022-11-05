import path from "node:path";
import {cwd} from "node:process";
import {fileURLToPath} from "node:url";

const SYSTEM_FILES_NAME = 'system', SYSTEM_FILES_DIRECTORY = 'dist';
const STATIC_NAME = 'static', STATIC_SOURCE_DIRECTORY = 'src';
const MODULES_NAME = 'node_modules', MODULE_SOURCE_DIRECTORY = 'node_modules';

const COMPILE_DIRECTORY = '-compile';

export function dirname(url: string) {
    return path.dirname(fileURLToPath(url));
}

export const workingDirectory = cwd();
export const frameworkFiles = path.join(dirname(import.meta.url), '..');

export const ScriptExtension = {
    pages: {
        page: 'page',
        model: 'model',
        component: 'comp',
    },
    get pagesArray(): string[] {
        return Object.values(this.pages);
    },
    get SSRExtensions() {
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
    get scriptArray() {
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
        system: LocateDir,
        node_modules: LocateDir
    }
}

export const directories: Directories = {
    fullWebsiteDirectory: null,
    Locate: {
        system: {
            compile: frameworkFiles,
            source: workingDirectory,
            virtualName: SYSTEM_FILES_NAME,
            dirName: path.parse(workingDirectory).name
        },
        static: null,
        node_modules: null
    }
};

export function setDirectories(directory: string) {
    const fullWebsiteDirectory = path.isAbsolute(directory) ? directory : path.join(workingDirectory, directory);
    directories.fullWebsiteDirectory = fullWebsiteDirectory;

    function GetSource(name: string) {
        return path.join(fullWebsiteDirectory, name);
    }

    function GetCompile(name: string) {
        return path.join(directories.Locate.system.compile, name + COMPILE_DIRECTORY);
    }

    directories.Locate.system.compile = GetSource(SYSTEM_FILES_DIRECTORY);

    directories.Locate.static = {
        source: GetSource(STATIC_SOURCE_DIRECTORY),
        compile: GetCompile(STATIC_NAME),
        virtualName: STATIC_NAME,
        dirName: STATIC_SOURCE_DIRECTORY
    };

    directories.Locate.node_modules = {
        source: GetSource(MODULE_SOURCE_DIRECTORY),
        compile: GetCompile(MODULES_NAME),
        virtualName: MODULES_NAME,
        dirName: MODULE_SOURCE_DIRECTORY
    };
}

export function relative(fullPath: string) {
    return path.relative(directories.fullWebsiteDirectory, fullPath);
}