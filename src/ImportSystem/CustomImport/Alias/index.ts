import packageExport from "./packageExport.js";
import thisPackage from '../../../../package.json' assert {type: 'json'};

export const aliasNames = [thisPackage.name];
export default function importAlias(originalPath: string): any {

    switch (originalPath) {
        case thisPackage.name:
            return packageExport();
        default:
            return false;
    }
}