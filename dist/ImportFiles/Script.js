import { transform } from "sucrase";
import { minify } from "terser";
import { PrintIfNew } from "../OutputInput/PrintNew.js";
import EasyFs from "../OutputInput/EasyFs.js";
import { BasicSettings, PagesInfo, UpdatePageDependency, SystemData } from "../RunTimeBuild/SearchFileSystem.js";
import EasySyntax from "../CompileCode/transform/EasySyntax.js";
import JSParser from "../CompileCode/JSParser.js";
import path from "path";
import { isTs } from "../CompileCode/InsertModels.js";
import StringTracker from "../EasyDebug/StringTracker.js";
//@ts-ignore-next-line
import ImportWithoutCache from './ImportWithoutCache.cjs';
import { v4 as uuid } from 'uuid';
async function ReplaceBefore(code, defineData) {
    code = await EasySyntax.BuildAndExportImports(code, defineData);
    return code;
}
function template(code, isDebug, dir, file) {
    return `${isDebug ? "require('source-map-support').install();" : ''}var __dirname=\`${JSParser.fixText(dir)}\`,__filename=\`${JSParser.fixText(file)}\`;module.exports = (async (require)=>{var module={exports:{}},exports=module.exports;${code}\nreturn module.exports;});`;
}
/**
 *
 * @param text
 * @param type
 * @returns
 */
async function BuildScript(filePath, savePath, isTypescript, isDebug) {
    const sourceMapFile = savePath.split(/\/|\\/).pop();
    const Options = {
        transforms: ["imports"],
        sourceMapOptions: {
            compiledFilename: sourceMapFile,
        },
        filePath: path.relative(path.dirname(savePath), filePath),
    }, define = {
        debug: "" + isDebug,
    };
    if (isTypescript) {
        Options.transforms.push("typescript");
    }
    let Result = await ReplaceBefore(await EasyFs.readFile(filePath), define), sourceMap;
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
    Result = template(new StringTracker(filePath, Result).eq, isDebug, path.dirname(filePath), filePath);
    if (isDebug) {
        Result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," +
            Buffer.from(sourceMap).toString("base64");
    }
    else {
        Result = (await minify(Result, { module: false })).code;
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
    if (!BasicSettings.ReqFileTypesArray.find((x) => FilePath.endsWith(x))) {
        FilePath =
            FilePath.substring(0, FilePath.length - path.extname(FilePath).length) +
                "." + BasicSettings.ReqFileTypes[isTs() ? "ts" : "js"];
    }
    return FilePath;
}
const SavedModules = {};
export default async function LoadImport(InStaticPath, typeArray, isDebug = false, useDeps, withoutCache = []) {
    let TimeCheck;
    InStaticPath = path.join(AddExtension(InStaticPath));
    const SavedModulesPath = path.join(typeArray[2], InStaticPath), filePath = typeArray[0] + InStaticPath;
    //wait if this module is on process, if not declare this as on process module
    let processEnd;
    if (!SavedModules[SavedModulesPath])
        SavedModules[SavedModulesPath] = new Promise(r => processEnd = r);
    else if (SavedModules[SavedModulesPath] instanceof Promise)
        await SavedModules[SavedModulesPath];
    //build paths
    const reBuild = !PagesInfo[SavedModulesPath] || PagesInfo[SavedModulesPath] != (TimeCheck = await EasyFs.stat(filePath, "mtimeMs"));
    if (reBuild) {
        await BuildScriptSmallPath(InStaticPath, typeArray, isDebug);
        TimeCheck = TimeCheck ?? await EasyFs.stat(filePath, "mtimeMs");
        await UpdatePageDependency(SavedModulesPath, TimeCheck);
    }
    if (useDeps) {
        useDeps[InStaticPath] = { thisFile: TimeCheck };
        useDeps = useDeps[InStaticPath];
    }
    const inheritanceCache = withoutCache[0] == InStaticPath;
    if (inheritanceCache)
        withoutCache.shift();
    else if (!reBuild && SavedModules[SavedModulesPath])
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
        return LoadImport(p, typeArray, isDebug, useDeps, inheritanceCache ? withoutCache : []);
    }
    const requirePath = path.join(typeArray[1], InStaticPath + ".cjs");
    let MyModule = await ImportWithoutCache(requirePath);
    MyModule = await MyModule(requireMap);
    SavedModules[SavedModulesPath] = MyModule;
    processEnd?.();
    return MyModule;
}
export function ImportFile(InStaticPath, typeArray, isDebug = false, useDeps, withoutCache) {
    if (!isDebug)
        return SavedModules[path.join(typeArray[2], InStaticPath)];
    return LoadImport(InStaticPath, typeArray, isDebug, useDeps, withoutCache);
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
