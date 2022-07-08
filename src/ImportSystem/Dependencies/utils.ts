import PPath from "../../Settings/PPath";
import EasyFS from "../../Util/EasyFS";

export function getChangeDate(file: PPath) {
    return EasyFS.stat(file.full, 'mtimeMs', true)
}

/**
     * It recursively updates the value of a file in the dependency tree
     * @param {PPath} file - The file that was changed
     * @param {any} value - The value to be updated in the tree
     * @param {any} depsStore - The object that contains all the dependencies.
     */
export function updateInAllTree(file: PPath, value: any, depsStore: any) {
    for (const key in depsStore) {
        if (key == file.small) {
            depsStore[key] = value
        } else if (typeof depsStore[key] == 'object') {
            updateInAllTree(file, value, depsStore[key])
        }
    }
}