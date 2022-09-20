import { GlobalSettings } from "../../../Settings/GlobalSettings.js";
import PPath from "../../../Settings/PPath.js";

const REQUIRE_METHOD = 'require'
export default abstract class IBuilder<T> {

    constructor(protected params: string[] = []){
    }

    isTypeScript(file: PPath){
        return file.ext == ".ts" || file.ext != ".js" && GlobalSettings.compile.typescript
    }

    abstract build(file: PPath, options?: T): Promise<string>;
}