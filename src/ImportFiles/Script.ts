import { Options as TransformOptions, transform } from "sucrase";
import { minify } from "terser";
import { PrintIfNew } from "../OutputInput/PrintNew";
import EasyFs from "../OutputInput/EasyFs";
import { BasicSettings, SystemData } from "../RunTimeBuild/SearchFileSystem";
import EasySyntax from "../CompileCode/transform/EasySyntax";
import JSParser from "../CompileCode/JSParser";
import path from "path";
import { isTs } from "../CompileCode/InsertModels";
import StringTracker from "../EasyDebug/StringTracker";
//@ts-ignore-next-line
import ImportWithoutCache from './ImportWithoutCache.cjs';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import { v4 as uuid } from 'uuid';
import { pageDeps } from "../OutputInput/StoreDeps";

async function ReplaceBefore(
  code: string,
  defineData: { [key: string]: string },
) {
  code = await EasySyntax.BuildAndExportImports(code, defineData);
  return code;
}

function template(code: string, isDebug: boolean, dir: string, file: string, params?: string) {
  return `${isDebug ? "require('source-map-support').install();" : ''}var __dirname="${JSParser.fixTextSimpleQuotes(dir)
    }",__filename="${JSParser.fixTextSimpleQuotes(file)
    }";module.exports = (async (require${params ? ',' + params : ''})=>{var module={exports:{}},exports=module.exports;${code}\nreturn module.exports;});`;
}

/**
 *
 * @param text
 * @param type
 * @returns
 */
async function BuildScript(filePath: string, savePath: string | null, isTypescript: boolean, isDebug: boolean, { params, haveSourceMap, fileCode }: { params?: string, haveSourceMap?: boolean, fileCode?: string } = {}): Promise<string> {

  const sourceMapFile = savePath && savePath.split(/\/|\\/).pop();

  const Options: TransformOptions = {
    transforms: ["imports"],
    sourceMapOptions: haveSourceMap ? {
      compiledFilename: sourceMapFile,
    }: undefined,
    filePath: haveSourceMap ? savePath && path.relative(path.dirname(savePath), filePath): undefined,

  },
    define = {
      debug: "" + isDebug,
    };

  if (isTypescript) {
    Options.transforms.push("typescript");
  }

  let Result = await ReplaceBefore(
    fileCode || await EasyFs.readFile(filePath),
    define,
  ),
    sourceMap: string;

  try {
    const { code, sourceMap: map } = transform(Result, Options);
    Result = code;
    sourceMap = JSON.stringify(map);
  } catch (err) {
    PrintIfNew({
      errorName: "compilation-error",
      text: `${err.message}, on file -> ${filePath}`,
    });
  }

  Result = template(
    Result,
    isDebug,
    path.dirname(filePath),
    filePath,
    params
  );

  if (isDebug) {
    if (haveSourceMap)
      Result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(sourceMap).toString("base64");
  } else {
    try {
      Result = (await minify(Result, { module: false })).code;
    } catch (err) {
      PrintIfNew({
        errorName: 'minify',
        text: `${err.message} on file -> ${filePath}`
      })
    }
  }

  if (savePath) {
    await EasyFs.makePathReal(path.dirname(savePath));
    await EasyFs.writeFile(savePath, Result);
  }
  return Result;
}

function CheckTs(FilePath: string) {
  return FilePath.endsWith(".ts");
}

export async function BuildScriptSmallPath(InStaticPath: string, typeArray: string[], isDebug = false,) {
  await EasyFs.makePathReal(InStaticPath, typeArray[1]);

  return await BuildScript(
    typeArray[0] + InStaticPath,
    typeArray[1] + InStaticPath + ".cjs",
    CheckTs(InStaticPath),
    isDebug,
  );
}

export function AddExtension(FilePath: string) {
  const fileExt = path.extname(FilePath);

  if (BasicSettings.partExtensions.includes(fileExt.substring(1)))
    FilePath += "." + (isTs() ? "ts" : "js")
  else if (fileExt == '')
    FilePath += "." + BasicSettings.ReqFileTypes[isTs() ? "ts" : "js"];

  return FilePath;
}

const SavedModules = {};

export default async function LoadImport(importFrom: string, InStaticPath: string, typeArray: string[], isDebug = false, useDeps?: StringAnyMap, withoutCache: string[] = []) {
  let TimeCheck: any;

  InStaticPath = path.join(AddExtension(InStaticPath).toLowerCase());
  const SavedModulesPath = path.join(typeArray[2], InStaticPath),
    filePath = typeArray[0] + InStaticPath;

  //wait if this module is on process, if not declare this as on process module
  let processEnd: (v?: any) => void;
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
      })
      SavedModules[SavedModulesPath] = null
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
    withoutCache.shift()
  else if (!reBuild && SavedModules[SavedModulesPath] && !(SavedModules[SavedModulesPath] instanceof Promise))
    return SavedModules[SavedModulesPath];

  function requireMap(p: string) {
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

export function ImportFile(importFrom: string, InStaticPath: string, typeArray: string[], isDebug = false, useDeps?: StringAnyMap, withoutCache?: string[]) {
  if (!isDebug) {
    const haveImport = SavedModules[path.join(typeArray[2], InStaticPath.toLowerCase())];
    if (haveImport !== undefined) return haveImport;
  }

  return LoadImport(importFrom, InStaticPath, typeArray, isDebug, useDeps, withoutCache);
}

export async function RequireOnce(filePath: string, isDebug: boolean) {

  const tempFile = path.join(SystemData, `temp-${uuid()}.cjs`);

  await BuildScript(
    filePath,
    tempFile,
    CheckTs(filePath),
    isDebug,
  );

  const MyModule = await ImportWithoutCache(tempFile);
  EasyFs.unlink(tempFile);

  return await MyModule((path: string) => import(path));
}

export async function RequireCjsScript(content: string) {

  const tempFile = path.join(SystemData, `temp-${uuid()}.cjs`);
  await EasyFs.writeFile(tempFile, content);

  const model = await ImportWithoutCache(tempFile);
  EasyFs.unlink(tempFile);

  return model;
}

export async function paramsImport(globalPrams: string, scriptLocation: string, inStaticLocationRelative: string, typeArray: string[], isTypeScript: boolean, isDebug: boolean, fileCode: string,  sourceMapComment: string) {
  await EasyFs.makePathReal(inStaticLocationRelative, typeArray[1]);

  const fullSaveLocation = scriptLocation + ".cjs";

  const Result = await BuildScript(
    scriptLocation,
    undefined,
    isTypeScript,
    isDebug,
    {params: globalPrams, haveSourceMap: false, fileCode}
  );

  await EasyFs.makePathReal(path.dirname(fullSaveLocation));
  await EasyFs.writeFile(fullSaveLocation, Result + sourceMapComment);

  function requireMap(p: string) {
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
  return async (...arr: any[]) => await MyModule(requireMap, ...arr);
}