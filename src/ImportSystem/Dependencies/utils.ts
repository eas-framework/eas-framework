import PPath from "../../Settings/PPath";
import EasyFS from "../../Util/EasyFS";

export function getChangeDate(file: PPath){
    return EasyFS.stat(file.full, 'mtimeMs', true)
}