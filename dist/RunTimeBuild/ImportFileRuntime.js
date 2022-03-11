import EasyFs from '../OutputInput/EasyFs.js';
import { ImportFile, AddExtension } from '../ImportFiles/Script.js';
import { PrintIfNew } from '../OutputInput/PrintNew.js';
import path from 'path';
const CacheRequireFiles = {};
async function makeDependencies(dependencies, typeArray, basePath = '', cache = {}) {
    const dependenciesMap = {};
    const promiseAll = [];
    for (const [filePath, value] of Object.entries(dependencies)) {
        promiseAll.push((async () => {
            if (filePath == 'thisFile') {
                if (!cache[basePath])
                    cache[basePath] = await EasyFs.stat(typeArray[0] + basePath, 'mtimeMs', true);
                dependenciesMap['thisFile'] = cache[basePath];
            }
            else {
                dependenciesMap[filePath] = await makeDependencies(value, typeArray, filePath, cache);
            }
        })());
    }
    await Promise.all(promiseAll);
    return dependenciesMap;
}
function compareDependenciesSame(oldDeps, newDeps) {
    for (const name in oldDeps) {
        if (name == 'thisFile') {
            if (newDeps[name] != oldDeps[name])
                return false;
        }
        else if (!compareDependenciesSame(oldDeps[name], newDeps[name]))
            return false;
    }
    return true;
}
function getChangeArray(oldDeps, newDeps, parent = '') {
    const changeArray = [];
    for (const name in oldDeps) {
        if (name == 'thisFile') {
            if (newDeps[name] != oldDeps[name]) {
                changeArray.push(parent);
                break;
            }
        }
        else if (!newDeps[name]) {
            changeArray.push(name);
            break;
        }
        else {
            const change = getChangeArray(oldDeps[name], newDeps[name], name);
            if (change.length) {
                if (parent)
                    changeArray.push(parent);
                changeArray.push(...change);
                break;
            }
        }
    }
    return changeArray;
}
export default async function RequireFile(filePath, __filename, __dirname, typeArray, LastRequire, isDebug) {
    const ReqFile = LastRequire[filePath];
    let fileExists, newDeps;
    if (ReqFile) {
        if (!isDebug || isDebug && (ReqFile.status == -1))
            return ReqFile.model;
        fileExists = await EasyFs.stat(typeArray[0] + ReqFile.path, 'mtimeMs', true, 0);
        if (fileExists) {
            newDeps = await makeDependencies(ReqFile.dependencies, typeArray);
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
            filePath = path.join(path.relative(__dirname, typeArray[0]), filePath);
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
            if (haveModel && compareDependenciesSame(haveModel.dependencies, newDeps = newDeps ?? await makeDependencies(haveModel.dependencies, typeArray)))
                LastRequire[copyPath] = haveModel;
            else {
                newDeps = newDeps ?? {};
                LastRequire[copyPath] = { model: await ImportFile(__filename, filePath, typeArray, isDebug, newDeps, haveModel && getChangeArray(haveModel.dependencies, newDeps)), dependencies: newDeps, path: filePath };
            }
        }
        else {
            LastRequire[copyPath] = { model: {}, status: 0, path: filePath };
            PrintIfNew({
                type: 'warn',
                errorName: 'import-not-exists',
                text: `Import '${filePath}' does not exists from '${__filename}'`
            });
        }
    }
    const builtModel = LastRequire[copyPath];
    CacheRequireFiles[builtModel.path] = builtModel;
    return builtModel.model;
}
//# sourceMappingURL=ImportFileRuntime.js.map