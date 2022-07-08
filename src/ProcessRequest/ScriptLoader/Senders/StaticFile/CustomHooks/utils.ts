import path from "node:path";
import { DAY_MILLISECONDS } from "../../../../../Settings/BasicConts";
import { GlobalSettings } from "../../../../../Settings/GlobalSettings";
import { workingDirectory } from "../../../../../Settings/ProjectConsts";
import EasyFS from "../../../../../Util/EasyFS";
import RequestWarper from "../../../../ProcessURL/RequestWarper";

export const NODE_MODULES = path.join(workingDirectory, 'node_modules')

export async function sendStaticFile(fullPath: string, fileType: 'default' | string, warper: RequestWarper, cacheFile = true){
    const text = await EasyFS.readFile(fullPath, 'utf8', true)

    if(text == null) { //error reading file - not exits
        return
    }

    if(cacheFile){
        warper.res.setHeader("Cache-Control", "max-age=" + (GlobalSettings.serveLimits.cacheDays * DAY_MILLISECONDS));
    }

    if(fileType == 'default'){
        fileType = path.extname(fullPath)
    }
    
    warper.res.type(fileType)
    warper.res.end(text)

    return true
}