import path from "node:path";
import {DAYS_IN_SECONDS} from "../../../../../Settings/BasicConts.js";
import {GlobalSettings} from "../../../../../Settings/GlobalSettings.js";
import {workingDirectory} from "../../../../../Settings/ProjectConsts.js";
import EasyFS from "../../../../../Util/EasyFS.js";
import RequestWrapper from "../../../../ProcessURL/RequestWrapper.js";

export const NODE_MODULES = path.join(workingDirectory, 'node_modules')

export async function sendStaticFile(fullPath: string, fileType: 'default' | string, wrapper: RequestWrapper, cacheFile = true){
    const text = await EasyFS.readFile(fullPath, 'utf8', true)

    if(text == null) { //error reading file - not exits
        return
    }

    if(cacheFile){
        wrapper.res.setHeader("Cache-Control", "max-age=" + (GlobalSettings.serveLimits.cacheDays * DAYS_IN_SECONDS));
    }

    if(fileType == 'default'){
        fileType = path.extname(fullPath)
    }
    
    wrapper.res.type(fileType)
    wrapper.res.end(text)

    return true
}