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
import ImportWithoutCache from '../ImportFiles/ImportWithoutCache.js';
async function ReplaceBefore(code, defineData) {
    code = await EasySyntax.BuildAndExportImports(code, defineData);
    return code;
}
function template(code, isDebug, dir, file) {
    return `${isDebug ? "import sourceMapSupport from 'source-map-support'; sourceMapSupport.install();" : ''};var __dirname=\`${JSParser.fixText(dir)}\`,__filename=\`${JSParser.fixText(file)}\`;export default (async (require)=>{var module={exports:{}},exports=module.exports;${code}\nreturn module.exports;});`;
}
/**
 *
 * @param text
 * @param type
 * @returns
 */
async function BuildScript(filePath, savePath, isTypescript, isDebug) {
    const sourceMapFile = filePath.split(/\/|\\/).pop();
    const Options = {
        transforms: ["imports"],
        sourceMapOptions: {
            compiledFilename: sourceMapFile,
        },
        filePath: path.relative(path.dirname(savePath), filePath)
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
    return await BuildScript(typeArray[0] + InStaticPath, typeArray[1] + InStaticPath + ".js", CheckTs(InStaticPath), isDebug);
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
export default async function LoadImport(InStaticPath, typeArray, isDebug = false) {
    let TimeCheck;
    const SavedModulesPath = path.join(typeArray[2], InStaticPath), filePath = typeArray[0] + InStaticPath;
    if (!PagesInfo[SavedModulesPath] || PagesInfo[SavedModulesPath] != (TimeCheck = await EasyFs.stat(filePath, "mtimeMs"))) {
        await BuildScriptSmallPath(InStaticPath, typeArray, isDebug);
        UpdatePageDependency(SavedModulesPath, TimeCheck ?? await EasyFs.stat(filePath, "mtimeMs"));
    }
    else if (SavedModules[SavedModulesPath]) {
        return SavedModules[SavedModulesPath];
    }
    function requireMap(p) {
        if (path.isAbsolute(p)) {
            p = path.normalize(p).substring(path.normalize(typeArray[0]).length);
        }
        else {
            if (p[0] == ".") {
                const dirPath = path.dirname(InStaticPath);
                p = (dirPath != "/" ? dirPath + "/" : "") + p;
            }
            else if (p[0] != "/") {
                return import(p);
            }
        }
        p = AddExtension(p);
        return LoadImport(p, typeArray, isDebug);
    }
    const requirePath = path.join(typeArray[1], InStaticPath + ".js");
    let MyModule = await ImportWithoutCache(requirePath, async (requirePath) => await import('file:///' + requirePath));
    MyModule = await MyModule.default(requireMap);
    SavedModules[SavedModulesPath] = MyModule;
    return MyModule;
}
export function ImportFile(InStaticPath, typeArray, isDebug = false) {
    if (!isDebug) {
        return SavedModules[typeArray[2] + "\\" + InStaticPath];
    }
    return LoadImport(InStaticPath, typeArray, isDebug);
}
export async function RequireOnce(filePath, isDebug) {
    const tempFile = path.join(SystemData, 'temp.js');
    await BuildScript(filePath, tempFile, CheckTs(filePath), isDebug);
    const MyModule = await ImportWithoutCache(tempFile, async (requirePath) => await import('file:///' + requirePath));
    return await MyModule.default((path) => import(path));
}
//# sourceMappingURL=Script.js.map