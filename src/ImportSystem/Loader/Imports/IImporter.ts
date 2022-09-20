import PPath from "../../../Settings/PPath.js"
import { getLocationStack } from "../../../Util/Runtime.js"
const STACK_BACK = 3;

export default abstract class IImporter {
    private importLineInfo: string
    public imported: any
    
    constructor(public file: PPath, importLine: string, protected importStack: IImporter[] = [], protected options: any) {
        this.importLineInfo = importLine
    }

    get importLine() {
        return this.importLineInfo
    }

    static importLocation(goBack = 0){
        return getLocationStack(STACK_BACK + goBack)
    }

    abstract createImport(): Promise<any>;
}