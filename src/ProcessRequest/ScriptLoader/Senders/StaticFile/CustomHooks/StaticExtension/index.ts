import {MSFiles} from "../../../../../../ImportSystem/Dependencies/StaticManagers.js";
import {GlobalSettings} from "../../../../../../Settings/GlobalSettings.js";
import RequestWrapper from "../../../../../ProcessURL/RequestWrapper.js";
import {sendStaticFile} from "../utils.js";
import {compileByExtension, SUPPORTED_TYPES} from "./BuiltinsExtnsionHooks/index.js";
import {WebsiteAllowBasicExtensions} from "./CommonFileExtensions.js";

let allowArray = [];

export function reFilterExtension() {
    allowArray = WebsiteAllowBasicExtensions.concat(GlobalSettings.routing.allowExt).filter(x => !GlobalSettings.routing.ignoreExt.includes(x));
}

const OVERRIDE_DEFAULT_EXTENSIONS = {
    ts: 'js',
    tsx: 'js',
    jsx: 'js',
    svelte: 'js',
    sass: 'css',
    scss: 'css'
};


export async function sendFileByExtension(wrapper: RequestWrapper) {
    let extension = wrapper.path.ext.substring(1);
    extension = OVERRIDE_DEFAULT_EXTENSIONS[extension] ?? extension;

    if (!allowArray.includes(extension)) {
        return;
    }

    /* Checking if the file is a supported type, if it is, it will compile it and send the compiled file. */
    if (SUPPORTED_TYPES.includes(extension)) {
        if (GlobalSettings.development) {
            const session = MSFiles.createSession();
            /* Checking if the file has changed, if it has, it will recompile it. */
            if (await session.treeChanged(wrapper.path) && await session.getNewTime(wrapper.path) != null) {
                await compileByExtension(wrapper.path, session);
            }
        }
        return sendStaticFile(wrapper.path.compile, extension, wrapper);
    }

    return sendStaticFile(wrapper.path.full, extension, wrapper);
}
