import path from "node:path";
import compileSvelte from "../../../../../Compilers/Svelte/Client";
import { MSFiles } from "../../../../../ImportSystem/Dependencies/StaticManagers";
import { GlobalSettings } from "../../../../../Settings/GlobalSettings";
import PPath from "../../../../../Settings/PPath";
import { directories, workingDirectory } from "../../../../../Settings/ProjectConsts";
import RequestWarper from "../../../../ProcessURL/RequestWarper";
import { NODE_MODULES, sendStaticFile } from "./utils";

const NODE_MODULES_SVELTE = path.join(NODE_MODULES, 'svelte')


const SVELTE_STYLE_EXTENSION = '.css'
const SVELTE_EXTENSION = '.svelte'

const SVELTE_RESOURCES_START = 'serv/svelte/'
const DEFAULT_RESOURCE_FILE = 'index.mjs'

/**
 * Recompile the file if it's been changed.
 * @param file 
 * @returns if the dep changed, return true, otherwise return false
 */
async function compileSvelteStaticFile(file: PPath) {
    const session = MSFiles.createSession()

    if (await session.treeChanged(file)) {
        return await compileSvelte(file, session)
    }
}

export async function svelteStyle(warper: RequestWarper, retry = true) {
    if (warper.path.nested.endsWith(SVELTE_EXTENSION + SVELTE_STYLE_EXTENSION)) {
        return
    }

    const fullCompilePath = path.join(directories.Locate.Static.compile, warper.path.nested)
    const sendStyle = await sendStaticFile(fullCompilePath, SVELTE_STYLE_EXTENSION.substring(1), warper)

    if (!sendStyle && GlobalSettings.development && retry) {
        if (await compileSvelteStaticFile(warper.path)) {
            return svelteStyle(warper, false)
        }
    }

    return true
}

export async function svelteStaticResources(warper: RequestWarper) {
    if (!warper.path.nested.startsWith(SVELTE_RESOURCES_START)){
        return
    }

    let resourceFile =  warper.path.nested.substring(SVELTE_RESOURCES_START.length)

    if(path.extname(resourceFile) == ''){
        resourceFile = path.join(resourceFile, DEFAULT_RESOURCE_FILE)
    }

    const fullSvelteResourcePath = path.join(NODE_MODULES_SVELTE, resourceFile)
   
    return sendStaticFile(fullSvelteResourcePath, 'default', warper)
}