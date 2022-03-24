import EasyFs from "../../../OutputInput/EasyFs";

export default function (path: string){
    return EasyFs.readJsonFile(path);
}