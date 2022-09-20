import { MSFiles } from "../../../../../../ImportSystem/Dependencies/StaticManagers.js";
import { GlobalSettings } from "../../../../../../Settings/GlobalSettings.js";
import RequestWarper from "../../../../../ProcessURL/RequestWarper.js";
import { sendStaticFile } from "../utils.js";
import { compileByExtension, SUPPORTED_TYPES } from "./BuiltinsExtnsionHooks/index.js";
import { WebsiteAllowBasicExtensions } from "./CommonFileExtensions.js";

let allowArray = []
export function reFilterExtension(){
    allowArray = WebsiteAllowBasicExtensions.concat(GlobalSettings.routing.allowExt).filter(x => !GlobalSettings.routing.ignoreExt.includes(x))
}

export async function sendFileByExtension(warper: RequestWarper) {
    const extension = warper.path.ext.substring(1)

    if(!allowArray.includes(extension)){
        return
    }

    /* Checking if the file is a supported type, if it is, it will compile it and send the compiled file. */
    if(SUPPORTED_TYPES.includes(extension)){
        if(GlobalSettings.development){
            const session = MSFiles.createSession()
            /* Checking if the file has changed, if it has, it will recompile it. */
            if(await session.treeChanged(warper.path)){
                await compileByExtension(warper.path, session)
            }
        }
        return sendStaticFile(warper.path.compile, extension, warper)
    }

    return sendStaticFile(warper.path.full, extension, warper)
}
