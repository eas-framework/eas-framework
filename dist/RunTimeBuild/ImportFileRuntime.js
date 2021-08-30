import EasyFs from '../OutputInput/EasyFs.js';
import { ImportFile, AddExtension } from '../ImportFiles/Script.js';
const CacheRequireFiles = {};
async function makeDependencies(dependencies) {
    const dependenciesMap = {};
    for (const filePath of dependencies)
        dependenciesMap[filePath] = await EasyFs.stat(filePath, 'mtimeMs', true);
    return dependenciesMap;
}
function compareDependenciesSame(oldDeps, newDeps) {
    for (const name in oldDeps)
        if (newDeps[name] != oldDeps[name])
            return false;
    return true;
}
function countTillLastChange(oldDeps, newDeps) {
    let counter = 0, change = 0;
    for (const name in oldDeps) {
        counter++;
        if (newDeps[name] != oldDeps[name])
            change = counter;
    }
    return change > 1 ? change : 0; // if there is one, that mean only the file changed without any dependencies
}
export default async function RequireFile(filePath, pathname, typeArray, LastRequire, isDebug) {
    const ReqFile = LastRequire[filePath];
    let fileExists, newDeps;
    if (ReqFile) {
        if (!isDebug || isDebug && (ReqFile.status == -1))
            return ReqFile.model;
        fileExists = await EasyFs.stat(typeArray[0] + ReqFile.path, 'mtimeMs', true, 0);
        if (fileExists) {
            newDeps = await makeDependencies(Object.keys(ReqFile.dependencies));
            if (compareDependenciesSame(ReqFile.dependencies, newDeps))
                return ReqFile.model;
        }
        else if (ReqFile.status == 0)
            return ReqFile.model;
    }
    const copyPath = filePath;
    let static_modules = false;
    if (!ReqFile) {
        if (filePath[0] == '.') {
            if (filePath[1] == '/')
                filePath = filePath.substring(2);
            filePath = pathname && (pathname + '/' + filePath) || filePath;
        }
        else if (filePath[0] != '/')
            static_modules = true;
        else
            filePath = filePath.substring(1);
    }
    else {
        filePath = ReqFile.path;
        static_modules = ReqFile.static;
    }
    if (static_modules)
        LastRequire[copyPath] = { model: await import(filePath), status: -1, static: true, path: filePath };
    else {
        // add serv.js or serv.ts if needed
        filePath = AddExtension(filePath);
        const fullPath = typeArray[0] + filePath;
        fileExists = fileExists ?? await EasyFs.stat(fullPath, 'mtimeMs', true, 0);
        if (fileExists) {
            const haveModel = CacheRequireFiles[filePath];
            if (haveModel && compareDependenciesSame(haveModel.dependencies, newDeps ?? await makeDependencies(Object.keys(haveModel.dependencies))))
                LastRequire[copyPath] = haveModel;
            else {
                newDeps = newDeps ?? {};
                LastRequire[copyPath] = { model: await ImportFile(filePath, typeArray, isDebug, newDeps, haveModel && countTillLastChange(haveModel.dependencies, newDeps)), dependencies: newDeps, path: filePath };
            }
        }
        else
            LastRequire[copyPath] = { model: {}, status: 0, path: filePath };
    }
    const builtModel = LastRequire[copyPath];
    CacheRequireFiles[builtModel.path] = builtModel;
    return builtModel.model;
}
