import path from "node:path";
import compileSvelte from "../../../../../Compilers/Svelte/Client.js";
import {MSFiles} from "../../../../../ImportSystem/Dependencies/StaticManagers.js";
import {GlobalSettings} from "../../../../../Settings/GlobalSettings.js";
import PPath from "../../../../../Settings/PPath.js";
import {directories} from "../../../../../Settings/ProjectConsts.js";
import RequestWrapper from "../../../../ProcessURL/RequestWrapper.js";
import {NODE_MODULES, sendStaticFile} from "./utils.js";

const NODE_MODULES_SVELTE = path.join(NODE_MODULES, 'svelte');


const SVELTE_STYLE_EXTENSION = '.css';
const SVELTE_EXTENSION = '.svelte';

const SVELTE_RESOURCES_START = 'serv/svelte/';
const DEFAULT_RESOURCE_FILE = 'index.mjs';

/**
 * Recompile the file if it's been changed.
 * @param file
 * @returns if the dep changed, return true, otherwise return false
 */
async function compileSvelteStaticFile(file: PPath) {
    const session = MSFiles.createSession();

    if (await session.treeChanged(file)) {
        return await compileSvelte(file, session);
    }
}

export async function svelteStyle(wrapper: RequestWrapper, retry = true) {
    if (!wrapper.path.nested.endsWith(SVELTE_EXTENSION + SVELTE_STYLE_EXTENSION)) {
        return;
    }

    const fullCompilePath = path.join(directories.Locate.static.compile, wrapper.path.nested);
    const sendStyle = await sendStaticFile(fullCompilePath, SVELTE_STYLE_EXTENSION.substring(1), wrapper);

    if (!sendStyle && GlobalSettings.development && retry) {
        if (await compileSvelteStaticFile(wrapper.path)) {
            return svelteStyle(wrapper, false);
        }
    }

    return true;
}

export async function svelteStaticResources(wrapper: RequestWrapper) {
    if (!wrapper.path.nested.startsWith(SVELTE_RESOURCES_START)) {
        return;
    }

    let resourceFile = wrapper.path.nested.substring(SVELTE_RESOURCES_START.length);

    if (path.extname(resourceFile) == '') {
        resourceFile = path.join(resourceFile, DEFAULT_RESOURCE_FILE);
    }

    const fullSvelteResourcePath = path.join(NODE_MODULES_SVELTE, resourceFile);

    return sendStaticFile(fullSvelteResourcePath, 'default', wrapper);
}