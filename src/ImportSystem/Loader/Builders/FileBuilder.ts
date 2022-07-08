import PPath from "../../../Settings/PPath";
import EasyFS from "../../../Util/EasyFS";
import { transpileCode } from "./BaseBuilders";
import IBuilder from "./IBuilder";

export default class FileBuilder extends IBuilder<any> {

    async build(file: PPath): Promise<string> {
        const content = await EasyFS.readFile(file.full)

        return transpileCode(content, file, this.params, this.isTypeScript(file))
    }
}