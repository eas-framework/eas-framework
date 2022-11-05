import path from "node:path";
import PPath from "../../../Settings/PPath.js";
import {directories} from "../../../Settings/ProjectConsts.js";
import {customImportPackage, isCustomPackage} from "../../CustomImport/index.js";
import IImporter from "./IImporter.js";

export default class PackageImporter extends IImporter {

    constructor(protected packageName: string, {
        options,
        importLine,
        importStack = []
    }: { options?: any, importLine?: string, importStack?: IImporter[] } = {}) {
        super(
            new PPath(
                path.join(directories.Locate.node_modules.virtualName, packageName)
            ),
            importLine,
            importStack,
            options
        );
    }


    async createImport() {
        if (isCustomPackage(this.packageName)) {
            return this.imported = await customImportPackage(this.packageName);
        }

        return this.imported = await import(this.packageName, this.options);
    }
}