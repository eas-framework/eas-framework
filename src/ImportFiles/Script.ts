import { TransformOptions, transform } from "esbuild-wasm";
import { PrintIfNew } from "../OutputInput/PrintNew";
import EasyFs from "../OutputInput/EasyFs";
import { BasicSettings, SystemData } from "../RunTimeBuild/SearchFileSystem";
import EasySyntax from "../CompileCode/transform/EasySyntax";
import JSParser from "../CompileCode/JSParser";
import path from "path";
import { isTs } from "../CompileCode/InsertModels";
import ImportWithoutCache from './redirectCJS';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import { v4 as uuid } from 'uuid';
import { pageDeps } from "../OutputInput/StoreDeps";
import CustomImport, { isPathCustom } from "./CustomImport/index";
import { ESBuildPrintError, ESBuildPrintErrorStringTracker, ESBuildPrintWarnings, ESBuildPrintWarningsStringTracker } from "../CompileCode/esbuild/printMessage";
import StringTracker from "../EasyDebug/StringTracker";
import { backToOriginal } from "../EasyDebug/SourceMapLoad";
import { AliasOrPackage } from "./CustomImport/Alias";

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
 * It takes a file path, and returns the compiled code.
 * @param {string} filePath - The path to the file that you want to compile.
 * @param {string | null} savePath - The path to save the compiled file to.
 * @param {boolean} isTypescript - boolean
 * @param {boolean} isDebug - boolean,
 * @param  - filePath: The path to the file you want to compile.
 * @returns The result of the script.
 */
async function BuildScript(filePath: string, savePath: string | null, isTypescript: boolean, isDebug: boolean, { params, templatePath = filePath, codeMinify = !isDebug, mergeTrack }: { codeMinify?: boolean, templatePath?: string, params?: string, mergeTrack?: StringTracker } = {}): Promise<string> {
  const Options: TransformOptions = {
    format: 'cjs',
    loader: isTypescript ? 'ts' : 'js',
    minify: codeMinify,
    sourcemap: isDebug ? (mergeTrack ? 'external' : 'inline') : false,
    sourcefile: savePath && path.relative(path.dirname(savePath), filePath),
    define: {
      debug: "" + isDebug
    }
  };

  let Result = await ReplaceBefore(mergeTrack?.eq || await EasyFs.readFile(filePath), {});
  Result = template(
    Result,
    isDebug,
    path.dirname(templatePath),
    templatePath,
    params
  );

  try {
    const { code, warnings, map } = await transform(Result, Options);
    if (mergeTrack) {
      ESBuildPrintWarningsStringTracker(mergeTrack, warnings);
      Result = (await backToOriginal(mergeTrack, code, map)).StringWithTack(savePath);
    } else {
      ESBuildPrintWarnings(warnings, filePath);
      Result = code;
    }
  } catch (err) {
    if (mergeTrack) {
      ESBuildPrintErrorStringTracker(mergeTrack, err);
    } else {
      ESBuildPrintError(err, filePath);
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

export async function BuildScriptSmallPath(InStaticPath: string, typeArray: string[], isDebug = false) {
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

/**
 * LoadImport is a function that takes a path to a file, and returns the module that is at that path
 * @param {string} importFrom - The path to the file that created this import.
 * @param {string} InStaticPath - The path to the file that you want to import.
 * @param {StringAnyMap} [useDeps] - This is a map of dependencies that will be used by the page.
 * @param {string[]} withoutCache - an array of paths that will not be cached.
 * @returns The module that was imported.
 */
export default async function LoadImport(importFrom: string, InStaticPath: string, typeArray: string[], isDebug = false, useDeps?: StringAnyMap, withoutCache: string[] = []) {
  let TimeCheck: any;
  const originalPath = path.normalize(InStaticPath.toLowerCase());

  InStaticPath = AddExtension(InStaticPath);
  const extension = path.extname(InStaticPath).substring(1), thisCustom = isPathCustom(originalPath, extension) || !['js', 'ts'].includes(extension);
  const SavedModulesPath = path.join(typeArray[2], InStaticPath), filePath = path.join(typeArray[0], InStaticPath);

  //wait if this module is on process, if not declare this as on process module
  let processEnd: (v?: any) => void;
  if (!SavedModules[SavedModulesPath])
    SavedModules[SavedModulesPath] = new Promise(r => processEnd = r);
  else if (SavedModules[SavedModulesPath] instanceof Promise)
    await SavedModules[SavedModulesPath];

  //build paths
  const reBuild = !pageDeps.store[SavedModulesPath] || pageDeps.store[SavedModulesPath] != (TimeCheck = await EasyFs.stat(filePath, "mtimeMs", true, null));


  if (reBuild) {
    TimeCheck = TimeCheck ?? await EasyFs.stat(filePath, "mtimeMs", true, null);
    if (TimeCheck == null) {
      PrintIfNew({
        type: 'warn',
        errorName: 'import-not-exists',
        text: `Import '${InStaticPath}' does not exists from '${importFrom}'`
      })
      SavedModules[SavedModulesPath] = null
      return null;
    }
    if (!thisCustom) // only if not custom build
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
      p = path.relative(p, typeArray[0]);
    else {
      if (p[0] == ".") {
        p = path.join(path.dirname(InStaticPath), p);
      }
      else if (p[0] != "/")
        return AliasOrPackage(p);
    }

    return LoadImport(filePath, p, typeArray, isDebug, useDeps, inheritanceCache ? withoutCache : []);
  }

  let MyModule: any;
  if (thisCustom) {
    MyModule = await CustomImport(originalPath, filePath, extension, requireMap);
  } else {
    const requirePath = path.join(typeArray[1], InStaticPath + ".cjs");
    MyModule = await ImportWithoutCache(requirePath);
    MyModule = await MyModule(requireMap);
  }

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

/**
 * It takes a fake script location, a file location, a type array, and a boolean for whether or not it's
 * a TypeScript file. It then compiles the script and returns a function that will run the module
 * This is for RunTime Compile Scripts
 * @param {string} globalPrams - string, scriptLocation: string, inStaticLocationRelative: string,
 * typeArray: string[], isTypeScript: boolean, isDebug: boolean, fileCode: string,  sourceMapComment:
 * string
 * @param {string} scriptLocation - The location of the script to be compiled.
 * @param {string} inStaticLocationRelative - The relative path to the file from the static folder.
 * @param {string[]} typeArray - [string, string]
 * @param {boolean} isTypeScript - boolean, isDebug: boolean, fileCode: string,  sourceMapComment:
 * string
 * @param {boolean} isDebug - If true, the code will be compiled with debug information.
 * @param {string} fileCode - The code that will be compiled and saved to the file.
 * @param {string} sourceMapComment - string
 * @returns A function that returns a promise.
 */
export async function compileImport(globalPrams: string, scriptLocation: string, inStaticLocationRelative: string, typeArray: string[], isTypeScript: boolean, isDebug: boolean, mergeTrack: StringTracker) {
  await EasyFs.makePathReal(inStaticLocationRelative, typeArray[1]);

  const fullSaveLocation = scriptLocation + ".cjs";
  const templatePath = typeArray[0] + inStaticLocationRelative;

  await BuildScript(
    scriptLocation,
    fullSaveLocation,
    isTypeScript,
    isDebug,
    { params: globalPrams, mergeTrack, templatePath, codeMinify: false }
  );

  function requireMap(p: string) {
    if (path.isAbsolute(p))
      p = path.relative(p, typeArray[0]);
    else {
      if (p[0] == ".") {
        p = path.join(inStaticLocationRelative, p);

      }
      else if (p[0] != "/")
        return AliasOrPackage(p);
    }

    return LoadImport(templatePath, p, typeArray, isDebug);
  }

  const MyModule = await ImportWithoutCache(fullSaveLocation);
  return async (...arr: any[]) => await MyModule(requireMap, ...arr);
}