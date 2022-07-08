import packageExport from "./packageExport";

//@ts-ignore-next-line
export const aliasNames = [packageName]
export default function ImportAlias(originalPath: string): any {

    switch (originalPath) {
        //@ts-ignore-next-line
        case packageName:
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