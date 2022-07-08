import { GlobalSettings } from "../../../Settings/GlobalSettings";
import PPath from "../../../Settings/PPath";

const REQUIRE_METHOD = 'require'
export default abstract class IBuilder<T> {

    constructor(protected params: string[] = []){
        this.params.unshift(REQUIRE_METHOD)
    }

    isTypeScript(file: PPath){
        return file.ext == ".ts" || file.ext != ".js" && GlobalSettings.compile.typescript
    }

    abstract build(file: PPath, options?: T): Promise<string>;
}