import path from "node:path";
import { SystemData } from "../../../../../Settings/ProjectConsts.js";
import RequestWarper from "../../../../ProcessURL/RequestWarper.js";
import { sendStaticFile } from "./utils";

interface buildIn {
    path?: string;
    ext?: string;
    type: string;
    inServer?: string;
    content?: string;
}

const staticFilesDirectory = path.join(SystemData, '..', 'static', 'client')

const staticInfo: buildIn[] = [{
    path: "serv/temp.js",
    type: "js",
    inServer: "buildTemplate.js"
},
{
    path: "serv/connect.js",
    type: "js",
    inServer: "makeConnection.js"
},
{
    path: "serv/md.js",
    type: "js",
    inServer: "markdownCopy.js"
}];

export default function staticFiles(warper: RequestWarper) {
    const haveStringFile = staticInfo.find(x => x.path == warper.path.nested)
    if(!haveStringFile){
        return false
    }
    
    const fullFilePath = path.join(staticFilesDirectory, haveStringFile.inServer)
    return sendStaticFile(fullFilePath, haveStringFile.type, warper)
}