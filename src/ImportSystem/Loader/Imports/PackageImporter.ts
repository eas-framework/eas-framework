import PPath from "../../../Settings/PPath";
import { customImportPackage, isCustomPackage } from "../../CustomImport";
import IImporter from "./IImporter";

export default class PackageImporter extends IImporter {

    constructor(protected packageName: string, { options, importLine, importStack = [] }: { options?: any, importLine?: string, importStack?: IImporter[] } = {}){
        super(new PPath(packageName), importLine, importStack, options)
    }


    async createImport(){
        if (isCustomPackage(this.packageName)) {
            return this.imported = await customImportPackage(this.packageName)
        }

        return this.imported = await import(this.packageName, this.options)
    }
}