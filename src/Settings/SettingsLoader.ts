import { copyJSON, mergeNested1 } from "../Util/MergeObjects"
import { GlobalSettings } from "./GlobalSettings"
import { ExportSettings } from "./types"
import { Server } from "http";
import { Http2Server } from "http2";
import { App as TinyApp } from '@tinyhttp/app';


const DEFAULT_SETTINGS_FILE = 'Settings'
const IMPORT_LOAD_METHOD = 'ServerStart'

async function loadFile(settingsFile = DEFAULT_SETTINGS_FILE): any{

}

let loadedFilesMethods = []
async function importOnLoad(array: string[]){

}

export async function callImportOnLoadMethods(app: TinyApp, server: Server | Http2Server){
    for(const method of loadedFilesMethods){
        await method(app, server, GlobalSettings)
    }
}

export async function loadSettings(settingsFile: string){
    const settings: ExportSettings = await loadFile(settingsFile)
    if(!settings) return

    if(settings.development){
        mergeNested1(settings, <any>settings.implDev)
    } else {
        mergeNested1(settings, <any>settings.implProd)
    }

    copyJSON(GlobalSettings, settings, ['development', 'implDev', 'implProd'])
    await importOnLoad(GlobalSettings.general.importOnLoad ?? [])

    GlobalSettings.development = settings.development
}