import PPath from "../../../Settings/PPath.js";
import StringTracker from "../../../SourceTracker/StringTracker/StringTracker.js";
import { transpileCode, TranspilerTemplate, transpileStringTracker } from "./BaseBuilders.js";
import IBuilder from "./IBuilder.js";

export default class STBuilder extends IBuilder<any> {
    private typeScriptAlwaysTrue: boolean
    private template?: TranspilerTemplate

    constructor(private content: StringTracker, options: {typeScriptAlwaysTrue?: boolean, params?: string[], template?: TranspilerTemplate}) {
        super(options.params)
        this.typeScriptAlwaysTrue = options.typeScriptAlwaysTrue
        this.template = options.template
    }

    build(file: PPath): Promise<string> {
        return transpileStringTracker(this.content, file, {
            params: this.params,
            isTypescript: this.typeScriptAlwaysTrue || this.isTypeScript(file),
            template: this.template
        })
    }
}