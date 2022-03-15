import { transform } from "sucrase";
import { minify } from "terser";
import { PrintIfNew } from "../OutputInput/PrintNew.js";
import EasyFs from "../OutputInput/EasyFs.js";
import { BasicSettings, SystemData } from "../RunTimeBuild/SearchFileSystem.js";
import EasySyntax from "../CompileCode/transform/EasySyntax.js";
import JSParser from "../CompileCode/JSParser.js";
import path from "path";
import { isTs } from "../CompileCode/InsertModels.js";
//@ts-ignore-next-line
import ImportWithoutCache from './ImportWithoutCache.cjs';
import { v4 as uuid } from 'uuid';
import { pageDeps } from "../OutputInput/StoreDeps.js";
async function ReplaceBefore(code, defineData) {
    code = await EasySyntax.BuildAndExportImports(code, defineData);
    return code;
}
function template(code, isDebug, dir, file, params) {
    return `${isDebug ? "require('source-map-support').install();" : ''}var __dirname="${JSParser.fixTextSimpleQuotes(dir)}",__filename="${JSParser.fixTextSimpleQuotes(file)}";module.exports = (async (require${params ? ',' + params : ''})=>{var module={exports:{}},exports=module.exports;${code}\nreturn module.exports;});`;
}
/**
 *
 * @param text
 * @param type
 * @returns
 */
async function BuildScript(filePath, savePath, isTypescript, isDebug, { params, haveSourceMap, fileCode } = {}) {
    const sourceMapFile = savePath && savePath.split(/\/|\\/).pop();
    const Options = {
        transforms: ["imports"],
        sourceMapOptions: haveSourceMap ? {
            compiledFilename: sourceMapFile,
        } : undefined,
        filePath: haveSourceMap ? savePath && path.relative(path.dirname(savePath), filePath) : undefined,
    }, define = {
        debug: "" + isDebug,
    };
    if (isTypescript) {
        Options.transforms.push("typescript");
    }
    let Result = await ReplaceBefore(fileCode || await EasyFs.readFile(filePath), define), sourceMap;
    try {
        const { code, sourceMap: map } = transform(Result, Options);
        Result = code;
        sourceMap = JSON.stringify(map);
    }
    catch (err) {
        PrintIfNew({
            errorName: "compilation-error",
            text: `${err.message}, on file -> ${filePath}`,
        });
    }
    Result = template(Result, isDebug, path.dirname(filePath), filePath, params);
    if (isDebug) {
        if (haveSourceMap)
            Result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(sourceMap).toString("base64");
    }
    else {
        try {
            Result = (await minify(Result, { module: false })).code;
        }
        catch (err) {
            PrintIfNew({
                errorName: 'minify',
                text: `${err.message} on file -> ${filePath}`
            });
        }
    }
    if (savePath) {
        await EasyFs.makePathReal(path.dirname(savePath));
        await EasyFs.writeFile(savePath, Result);
    }
    return Result;
}
function CheckTs(FilePath) {
    return FilePath.endsWith(".ts");
}
export async function BuildScriptSmallPath(InStaticPath, typeArray, isDebug = false) {
    await EasyFs.makePathReal(InStaticPath, typeArray[1]);
    return await BuildScript(typeArray[0] + InStaticPath, typeArray[1] + InStaticPath + ".cjs", CheckTs(InStaticPath), isDebug);
}
export function AddExtension(FilePath) {
    const fileExt = path.extname(FilePath);
    if (BasicSettings.partExtensions.includes(fileExt.substring(1)))
        FilePath += "." + (isTs() ? "ts" : "js");
    else if (fileExt == '')
        FilePath += "." + BasicSettings.ReqFileTypes[isTs() ? "ts" : "js"];
    return FilePath;
}
const SavedModules = {};
export default async function LoadImport(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache = []) {
    let TimeCheck;
    InStaticPath = path.join(AddExtension(InStaticPath).toLowerCase());
    const SavedModulesPath = path.join(typeArray[2], InStaticPath), filePath = typeArray[0] + InStaticPath;
    //wait if this module is on process, if not declare this as on process module
    let processEnd;
    if (!SavedModules[SavedModulesPath])
        SavedModules[SavedModulesPath] = new Promise(r => processEnd = r);
    else if (SavedModules[SavedModulesPath] instanceof Promise)
        await SavedModules[SavedModulesPath];
    //build paths
    const reBuild = !pageDeps.store[SavedModulesPath] || pageDeps.store[SavedModulesPath] != (TimeCheck = await EasyFs.stat(filePath, "mtimeMs", true));
    if (reBuild) {
        TimeCheck = TimeCheck ?? await EasyFs.stat(filePath, "mtimeMs", true);
        if (TimeCheck == null) {
            PrintIfNew({
                type: 'warn',
                errorName: 'import-not-exists',
                text: `Import '${InStaticPath}' does not exists from '${importFrom}'`
            });
            SavedModules[SavedModulesPath] = null;
            return null;
        }
        await BuildScriptSmallPath(InStaticPath, typeArray, isDebug);
        pageDeps.update(SavedModulesPath, TimeCheck);
    }
    if (useDeps) {
        useDeps[InStaticPath] = { thisFile: TimeCheck };
        useDeps = useDeps[InStaticPath];
    }
    const inheritanceCache = withoutCache[0] == InStaticPath;
    if (inheritanceCache)
        withoutCache.shift();
    else if (!reBuild && SavedModules[SavedModulesPath] && !(SavedModules[SavedModulesPath] instanceof Promise))
        return SavedModules[SavedModulesPath];
    function requireMap(p) {
        if (path.isAbsolute(p))
            p = path.normalize(p).substring(path.normalize(typeArray[0]).length);
        else {
            if (p[0] == ".") {
                const dirPath = path.dirname(InStaticPath);
                p = (dirPath != "/" ? dirPath + "/" : "") + p;
            }
            else if (p[0] != "/")
                return import(p);
        }
        return LoadImport(filePath, p, typeArray, isDebug, useDeps, inheritanceCache ? withoutCache : []);
    }
    const requirePath = path.join(typeArray[1], InStaticPath + ".cjs");
    let MyModule = await ImportWithoutCache(requirePath);
    MyModule = await MyModule(requireMap);
    SavedModules[SavedModulesPath] = MyModule;
    processEnd?.();
    return MyModule;
}
export function ImportFile(importFrom, InStaticPath, typeArray, isDebug = false, useDeps, withoutCache) {
    if (!isDebug) {
        const haveImport = SavedModules[path.join(typeArray[2], InStaticPath.toLowerCase())];
        if (haveImport !== undefined)
            return haveImport;
    }
    return LoadImport(importFrom, InStaticPath, typeArray, isDebug, useDeps, withoutCache);
}
export async function RequireOnce(filePath, isDebug) {
    const tempFile = path.join(SystemData, `temp-${uuid()}.cjs`);
    await BuildScript(filePath, tempFile, CheckTs(filePath), isDebug);
    const MyModule = await ImportWithoutCache(tempFile);
    EasyFs.unlink(tempFile);
    return await MyModule((path) => import(path));
}
export async function RequireCjsScript(content) {
    const tempFile = path.join(SystemData, `temp-${uuid()}.cjs`);
    await EasyFs.writeFile(tempFile, content);
    const model = await ImportWithoutCache(tempFile);
    EasyFs.unlink(tempFile);
    return model;
}
export async function paramsImport(globalPrams, scriptLocation, inStaticLocationRelative, typeArray, isTypeScript, isDebug, fileCode, sourceMapComment) {
    await EasyFs.makePathReal(inStaticLocationRelative, typeArray[1]);
    const fullSaveLocation = scriptLocation + ".cjs";
    const Result = await BuildScript(scriptLocation, undefined, isTypeScript, isDebug, { params: globalPrams, haveSourceMap: false, fileCode });
    await EasyFs.makePathReal(path.dirname(fullSaveLocation));
    await EasyFs.writeFile(fullSaveLocation, Result + sourceMapComment);
    function requireMap(p) {
        if (path.isAbsolute(p))
            p = path.normalize(p).substring(path.normalize(typeArray[0]).length);
        else {
            if (p[0] == ".") {
                const dirPath = path.dirname(inStaticLocationRelative);
                p = (dirPath != "/" ? dirPath + "/" : "") + p;
            }
            else if (p[0] != "/")
                return import(p);
        }
        return LoadImport(inStaticLocationRelative, p, typeArray, isDebug);
    }
    const MyModule = await ImportWithoutCache(fullSaveLocation);
    return async (...arr) => await MyModule(requireMap, ...arr);
}
//# sourceMappingURL=Script.js.map