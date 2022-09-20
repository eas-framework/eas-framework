import PPath from "../../../Settings/PPath.js";
import EasyFS from "../../../Util/EasyFS.js";
import { transpileCode } from "./BaseBuilders.js";
import IBuilder from "./IBuilder.js";

export default class FileBuilder extends IBuilder<any> {

    async build(file: PPath): Promise<string> {
        const content = await EasyFS.readFile(file.full)

        return transpileCode(content, file,{
            isTypescript: this.isTypeScript(file),
            params: this.params
        })
    }
}