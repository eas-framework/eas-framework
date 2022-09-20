import EasyFS from "../../../Util/EasyFS.js";

export default function (path: string){
    return EasyFS.readJsonFile(path);
}