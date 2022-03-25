import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import EasyFs from '../OutputInput/EasyFs';
import { ImportFile, AddExtension } from '../ImportFiles/Script';
import { createNewPrint } from '../OutputInput/PrintNew';
import path from 'path';
import { AliasOrPackage } from '../ImportFiles/CustomImport/Alias';
import { print } from '../OutputInput/Console';

type RequireFiles = {
    path: string
    status?: number
    model: any
    dependencies?: StringAnyMap
    static?: boolean
}

const CacheRequireFiles = {};

/**
 * It makes a map of dependencies.
 * @param {StringAnyMap} dependencies - The old dependencies object
 * @param {string[]} typeArray - The array of base paths
 * @param [basePath] - The path to the file that is being compiled.
 * @param cache - A cache of the last time a file was modified.
 * @returns A map of dependencies.
 */
async function makeDependencies(dependencies: StringAnyMap, typeArray: string[], basePath = '', cache = {}) {
    const dependenciesMap: StringAnyMap = {};
    const promiseAll = [];
    for (const [filePath, value] of Object.entries(dependencies)) {
        promiseAll.push((async () => {
            if (filePath == 'thisFile') {
                if (!cache[basePath])
                    cache[basePath] = await EasyFs.stat(typeArray[0] + basePath, 'mtimeMs', true);
                dependenciesMap['thisFile'] = cache[basePath];
            } else {
                dependenciesMap[filePath] = await makeDependencies(<any>value, typeArray, filePath, cache);
            }
        }
        )());
    }

    await Promise.all(promiseAll);
    return dependenciesMap;
}

/**
 * If the old dependencies and the new dependencies are the same, return true
 * @param {StringAnyMap} oldDeps - The old dependency map.
 * @param {StringAnyMap} newDeps - The new dependencies.
 * @returns The return value is a boolean value indicating whether the dependencies are the same.
 */
function compareDependenciesSame(oldDeps: StringAnyMap, newDeps: StringAnyMap) {
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

/**
 * Given two dependency trees, return an array of the names of the modules that have changed
 * @param {StringAnyMap} oldDeps - The old dependencies.
 * @param {StringAnyMap} newDeps - The new dependencies.
 * @param [parent] - The name of the parent module.
 * @returns The return value is an array of strings. Each string represents a change in the dependency
 * tree.
 */
function getChangeArray(oldDeps: StringAnyMap, newDeps: StringAnyMap, parent = ''): string[] {
    const changeArray = [];

    for (const name in oldDeps) {
        if (name == 'thisFile') {
            if (newDeps[name] != oldDeps[name]) {
                changeArray.push(parent);
                break;
            }
        } else if (!newDeps[name]) {
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

/**
 * It imports a file and returns the model.
 * @param {string} filePath - The path to the file that you want to import.
 * @param {string} __filename - The filename of the file that is currently being executed.
 * @param {string} __dirname - The directory of the file that is currently being executed.
 * @param {string[]} typeArray - paths types.
 * @param LastRequire - A map of all the files that have been required so far.
 * @param {boolean} isDebug - boolean
 * @returns The model that is being imported.
 */
export default async function RequireFile(filePath: string, __filename: string, __dirname: string, typeArray: string[], LastRequire: { [key: string]: RequireFiles }, isDebug: boolean) {
    const ReqFile = LastRequire[filePath];

    let fileExists: number, newDeps: StringAnyMap;
    if (ReqFile) {

        if (!isDebug || isDebug && (ReqFile.status == -1))
            return ReqFile.model;

        fileExists = await EasyFs.stat(typeArray[0] + ReqFile.path, 'mtimeMs', true, 0);
        if (fileExists) {

            newDeps = await makeDependencies(ReqFile.dependencies, typeArray);

            if (compareDependenciesSame(ReqFile.dependencies, newDeps))
                return ReqFile.model;

        } else if (ReqFile.status == 0)
            return ReqFile.model;
    }

    const copyPath = filePath;
    let static_modules = false;

    if (!ReqFile) {
        if (filePath[0] == '.') {

            if (filePath[1] == '/')
                filePath = filePath.substring(2);

            filePath = path.join(path.relative(typeArray[0], __dirname), filePath);
        } else if (filePath[0] != '/')
            static_modules = true;

        else
            filePath = filePath.substring(1);

    } else {
        filePath = ReqFile.path;
        static_modules = ReqFile.static;
    }

    if (static_modules)
        LastRequire[copyPath] = { model: await AliasOrPackage(copyPath), status: -1, static: true, path: filePath };
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

                LastRequire[copyPath] = { model: await ImportFile(__filename, filePath, typeArray, isDebug, newDeps, haveModel && getChangeArray(haveModel.dependencies, newDeps)), dependencies: newDeps, path: filePath }
            }
        }
        else {
            LastRequire[copyPath] = { model: {}, status: 0, path: filePath };
            const [funcName, printText] = createNewPrint({
                type: 'warn',
                errorName: 'import-not-exists',
                text: `Import '${filePath}' does not exists from '${__filename}'`
            });
            print[funcName](printText);
        }
    }

    const builtModel = LastRequire[copyPath];
    CacheRequireFiles[builtModel.path] = builtModel;

    return builtModel.model;
}