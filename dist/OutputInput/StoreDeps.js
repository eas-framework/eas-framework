import { BasicSettings } from "../RunTimeBuild/SearchFileSystem.js";
import EasyFs from "./EasyFs.js";
import StoreJSON from "./StoreJSON.js";
export const pageDeps = new StoreJSON('PagesInfo');
export async function CheckDependencyChange(path, dependencies = pageDeps.store[path]) {
    for (const i in dependencies) {
        let p = i;
        if (i == 'thisPage') {
            p = path + "." + BasicSettings.pageTypes.page;
        }
        const FilePath = BasicSettings.fullWebSitePath + p;
        if (await EasyFs.stat(FilePath, 'mtimeMs', true) != dependencies[i]) {
            return true;
        }
    }
    return !dependencies;
}
//# sourceMappingURL=StoreDeps.js.map