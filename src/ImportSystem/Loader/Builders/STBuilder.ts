import PPath from "../../../Settings/PPath";
import StringTracker from "../../../SourceTracker/StringTracker/StringTracker";
import EasyFS from "../../../Util/EasyFS";
import { transpileCode, transpileStringTracker } from "./BaseBuilders";
import IBuilder from "./IBuilder";

export default class STBuilder extends IBuilder<any> {

    constructor(private content: StringTracker, private typeScriptAlwaysTrue?: boolean, params?: string[]) {
        super(params)
    }

    async build(file: PPath): Promise<string> {

        return transpileStringTracker(this.content, file, this.params, this.typeScriptAlwaysTrue || this.isTypeScript(file))
    }
}