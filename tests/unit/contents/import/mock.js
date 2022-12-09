import { utimes } from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import PPath from "../../../../src/Settings/PPath.js";
import { directories } from "../../../../src/Settings/ProjectConsts.js";
const TEST_NAME = 'Test';
export const filesDir = fileURLToPath(dirname(import.meta.url));
const fileDirectories = directories;
fileDirectories.Locate[TEST_NAME] = {
    source: filesDir,
    compile: directories.Locate.static.compile,
    virtualName: TEST_NAME,
    dirName: 'import'
};
export function createImportPath(file) {
    return new PPath(path.join(TEST_NAME, file));
}
export async function triggerHotReload(file) {
    const fullPath = path.join(filesDir, file);
    const now = new Date();
    await utimes(fullPath, now, now);
}
