import packageExport from "./packageExport.js";
//@ts-ignore-next-line
const thisPackageName = typeof packageName == 'undefined' ? '@thisPackage': packageName;

//@ts-ignore-next-line
export const aliasNames = [thisPackageName]
export default function ImportAlias(originalPath: string): any {

    switch (originalPath) {
        case thisPackageName:
            return packageExport()
        default:
            return false;
    }
}

export function aliasOrPackage(originalPath: string) {
    const hasAlias = ImportAlias(originalPath);
    if (hasAlias) {
        return hasAlias
    }
    return import(originalPath);
}