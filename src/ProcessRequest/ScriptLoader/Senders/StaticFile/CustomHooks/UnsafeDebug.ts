import path from "node:path";
import { argv } from "node:process";
import prompts from "prompts";
import { GlobalSettings } from "../../../../../Settings/GlobalSettings.js";
import { directories } from "../../../../../Settings/ProjectConsts.js";
import { hasPlugin, safeDebug } from "../../../../../Settings/utils.js";
import RequestWarper from "../../../../ProcessURL/RequestWarper.js";
import { sendStaticFile } from "./utils.js";
export const DEBUG_PAGE_EXTENSION = '.source'

let debuggingWithSource: null | boolean = argv.includes('allowSourceDebug') || null;
async function askDebuggingWithSource() {
    if (typeof debuggingWithSource == 'boolean')
        return debuggingWithSource

    debuggingWithSource = (await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Do you want to allow source debugging?',
        initial: false
    }))?.value

    return debuggingWithSource
}

export default async function unsafeDebugPages(warper: RequestWarper) {
    const folderName = warper.path.nested.split(path.sep).shift()
    const haveFolder = Object.values(directories.Locate).find(x => x.dirName == folderName)
    const fileExt = path.extname(warper.path.nested);

    if(!GlobalSettings.development || safeDebug() || path.extname(fileExt) != DEBUG_PAGE_EXTENSION || !haveFolder || !await askDebuggingWithSource()){
        return
    }

    
    const fullPath = path.join(directories.fullWebsiteDirectory, warper.path.nested.substring(0, warper.path.nested.length - DEBUG_PAGE_EXTENSION.length)); // removing '.source'

    return sendStaticFile(fullPath, 'default', warper)
}