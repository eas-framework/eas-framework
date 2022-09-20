import PPath from "../../../../Settings/PPath.js"
import { IMPORT_FILE_EXTENSION } from "./NodeImporter.js"

export function defaultExportFile(file: PPath){
    const copy = file.clone()
    copy.nested += IMPORT_FILE_EXTENSION

    return copy
}