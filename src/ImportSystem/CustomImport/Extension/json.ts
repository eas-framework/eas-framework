import EasyFS from "../../../Util/EasyFS";

export default function (path: string){
    return EasyFS.readJsonFile(path);
}