import path from "node:path"
import { cwd } from "node:process"
import { fileURLToPath } from "node:url"

const StaticName = 'Static', StaticSourceDirectory = 'WWW', ModulesName = 'node_modules', ModelsName = 'Models', ComponentsName = 'Components';
const ModulesCompileDirectoryName = 'Modules'
const CompileNameDirectory = 'Compile'

function dirname(url: string) {
    return path.dirname(fileURLToPath(url))
}

export const SystemData = path.join(dirname(import.meta.url), '..', 'SystemData')
export const workingDirectory = cwd()

export const ScriptExtension = {
    pages: {
        page: 'page',
        model: 'model',
        component: 'comp',
    },
    get pagesArray(): string[]{
        return Object.values(this.pages)
    },
    get pagesCodeFilesArray(){
        return this.pagesArray.map(ext => [`${ext}.ts`, `${ext}.js`]).flat()
    },
    partExtensions: ['hide', 'api'],
    script: {
        get js(){
            return ScriptExtension.partExtensions[0] + '.js'
        },
        get ts(){
            return ScriptExtension.partExtensions[0] + '.ts'
        },
        get 'api-ts'(){
            return ScriptExtension.partExtensions[1] + '.ts'
        },
        get 'api-js'(){
            return ScriptExtension.partExtensions[1] + '.js'
        }
    },
    scriptArray(){
        return Object.values(this.script)
    }
}

export type LocateDir = {
    source: string
    compile: string
    virtualName: string,
    dirName: string
}

type Directories = {
    fullWebsiteDirectory: string
    Locate: {
        Static: LocateDir,
        Models: LocateDir,
        Components: LocateDir,
        node_modules: LocateDir
    }
}

export const directories: Directories = {
    fullWebsiteDirectory: null,
    Locate: {
        Static: null,
        Models: null,
        Components: null,
        node_modules: null
    }
}
export function setDirectories(directory: string) {
    const fullWebsiteDirectory = path.join(workingDirectory, directory)
    directories.fullWebsiteDirectory = fullWebsiteDirectory

    function GetSource(name: string) {
        return path.join(fullWebsiteDirectory, name)
    }

    function GetCompile(name: string) {
        return path.join(SystemData, name + CompileNameDirectory);
    }

    const StaticCompile = GetCompile(StaticName)
    directories.Locate.Static = {
        source: GetSource(StaticSourceDirectory),
        compile: StaticCompile,
        virtualName: StaticName,
        dirName: StaticSourceDirectory
    }

    directories.Locate.Models = {
        source: GetSource(ModelsName),
        compile: StaticCompile,
        virtualName: ModelsName,
        dirName: ModelsName
    }

    directories.Locate.Components = {
        source: GetSource(ComponentsName),
        compile: StaticCompile,
        virtualName: ComponentsName,
        dirName: ComponentsName
    }

    directories.Locate.node_modules = {
        source: GetSource(ModulesName),
        compile: GetCompile(ModulesCompileDirectoryName),
        virtualName: ModulesName,
        dirName: ModulesName
    }
}

export function relative(fullPath: string) {
    return path.relative(directories.fullWebsiteDirectory, fullPath)
}

function init(){
    setDirectories('.')
} init()