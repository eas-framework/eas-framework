import path from "path";
import { MPages } from "../../../ImportSystem/Dependencies/StaticManagers";
import { GlobalSettings } from "../../../Settings/GlobalSettings";
import { directories, ScriptExtension } from "../../../Settings/ProjectConsts";
import RequestParser from "../RequestParser";

export default async function activatePage(parser: RequestParser) {
    const pageFile = parser.warper.path.clone()
    pageFile.nested += '.' + ScriptExtension.pages.page

    const session = MPages.createSession()

    if(await session.getNewTime(pageFile) == null){ // page doesn't exist
        return
    }

    if (GlobalSettings.development && await session.treeChanged(pageFile)) {
        await recompilePage(parser)
    }



}

async function recompilePage(parser: RequestParser){
    
}