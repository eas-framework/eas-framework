import { StringNumberMap } from "../CompileCode/XMLHelpers/CompileTypes";
import { BasicSettings } from "../RunTimeBuild/SearchFileSystem";
import EasyFs from "./EasyFs";
import StoreJSON from "./StoreJSON";

export const pageDeps = new StoreJSON('PagesInfo')

/**
 * Check if any of the dependencies of the page have changed
 * @param {string} path - The path to the page.
 * @param {StringNumberMap} dependencies - A map of dependencies. The key is the path to the file, and
 * the value is the last modified time of the file.
 * @returns A boolean value.
 */
export async function CheckDependencyChange(path:string, dependencies: StringNumberMap = pageDeps.store[path]) {
    for (const i in dependencies) {
        let p = i;

        if (i == 'thisPage') {
            p = path + "." + BasicSettings.pageTypes.page;
        }

        const FilePath = BasicSettings.fullWebSitePath  + p;
        if (await EasyFs.stat(FilePath, 'mtimeMs', true) != dependencies[i]) {
            return true;
        }
    }
    
    return !dependencies;
}