import { Options as TransformOptions, transform } from '@swc/core';
import { createNewPrint } from "../OutputInput/Logger";
import EasyFs from "../OutputInput/EasyFs";
import { BasicSettings, getTypes, SystemData, workingDirectory } from "../RunTimeBuild/SearchFileSystem";
import JSParser from "../CompileCode/JSParser";
import path from "path";
import { GetPlugin, isTs } from "../CompileCode/InsertModels";
import ImportWithoutCache from './redirectCJS';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import { v4 as uuid } from 'uuid';
import { pageDeps } from "../OutputInput/StoreDeps";
import CustomImport, { isPathCustom } from "./CustomImport/index";
import { ESBuildPrintError, ESBuildPrintErrorStringTracker } from "../CompileCode/transpiler/printMessage";
import StringTracker from "../EasyDebug/StringTracker";
import { backToOriginal } from "../EasyDebug/SourceMapLoad";
import { AliasOrPackage } from "./CustomImport/Alias";
import { print } from "../OutputInput/Console";
import { TransformJSC } from '../CompileCode/transpiler/settings';
import { TransformSettings } from '../CompileCode/transform/Script';
import EasySyntax from '../CompileCode/transform/EasySyntax';


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

    jsc: TransformJSC({
      parser: {
        syntax: isTypescript ? "typescript" : "ecmascript",
        ...GetPlugin((isTypescript ? 'TS' : 'JS') + "Options")
      }
    }, { __DEBUG__: '' + isDebug, ...TransformSettings.globals }, true),

    minify: codeMinify,
    filename: filePath,
    sourceMaps: isDebug ? (mergeTrack ? true : 'inline') : false,
    outputPath: savePath && path.relative(path.dirname(savePath), filePath)
  };

  let Result = mergeTrack?.eq || await EasyFs.readFile(filePath);

  const CommonJSScript = await EasySyntax.BuildAndExportImports(Result)
  Result = template(CommonJSScript, isDebug, path.dirname(templatePath), templatePath, params);

  try {
    const { code, map } = await transform(Result, Options);

    Result = mergeTrack && map && (await backToOriginal(mergeTrack, code, map)).StringWithTack(savePath) || code;

  } catch (err) {
    if (mergeTrack) {
      ESBuildPrintErrorStringTracker(mergeTrack, err, mergeTrack.extractInfo());
    } else {
      ESBuildPrintError(err);
    }
  }

  if (savePath) {
    await EasyFs.makePathReal(savePath);
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

const SavedModules = {}, PrepareMap = {};

/**
 * LoadImport is a function that takes a path to a file, and returns the module that is at that path
 * @param {string[]} importFrom - The path to the file that created this import.
 * @param {string} InStaticPath - The path to the file that you want to import.
 * @param {StringAnyMap} [useDeps] - This is a map of dependencies that will be used by the page.
 * @param {string[]} withoutCache - an array of paths that will not be cached.
 * @returns The module that was imported.
 */
export default async function LoadImport(importFrom: string[], InStaticPath: string, typeArray: string[], { isDebug = false, useDeps, withoutCache = [], onlyPrepare }: { isDebug: boolean, useDeps?: StringAnyMap, withoutCache?: string[], onlyPrepare?: boolean }) {
  let TimeCheck: any;
  const originalPath = path.normalize(InStaticPath.toLowerCase());

  InStaticPath = AddExtension(InStaticPath);
  const extension = path.extname(InStaticPath).substring(1), thisCustom = isPathCustom(originalPath, extension) || !['js', 'ts'].includes(extension);
  const SavedModulesPath = path.join(typeArray[2], InStaticPath), filePath = path.join(typeArray[0], InStaticPath);

  if (importFrom.includes(SavedModulesPath)) {
    /**
     * return a string of the stack importing this module
     */
    const getStackString = () => [SavedModulesPath].concat(
      importFrom.slice(importFrom.indexOf(SavedModulesPath))
        .map(x => BasicSettings.fullWebSitePath + x)
    ).join(' ->\n');

    const [funcName, printText] = createNewPrint({
      type: 'error',
      errorName: 'circle-import',
      text: `Import '${SavedModulesPath}' creates a circular dependency <color>${getStackString()}`
    });
    print[funcName](printText);
    SavedModules[SavedModulesPath] = null
    useDeps[InStaticPath] = { thisFile: -1 };
    return null
  }

  //wait if this module is on process, if not declare this as on process module
  let processEnd: (v?: any) => void;
  if (!onlyPrepare) {
    if (!SavedModules[SavedModulesPath])
      SavedModules[SavedModulesPath] = new Promise(r => processEnd = r);
    else if (SavedModules[SavedModulesPath] instanceof Promise)
      await SavedModules[SavedModulesPath];
  }


  //build paths
  const reBuild = !pageDeps.store[SavedModulesPath] || pageDeps.store[SavedModulesPath] != (TimeCheck = await EasyFs.stat(filePath, "mtimeMs", true, null));


  if (reBuild) {
    TimeCheck = TimeCheck ?? await EasyFs.stat(filePath, "mtimeMs", true, null);
    if (TimeCheck == null) {
      const [funcName, printText] = createNewPrint({
        type: 'warn',
        errorName: 'import-not-exists',
        text: `Import '${InStaticPath}' does not exists from <color>'${BasicSettings.fullWebSitePath + importFrom.at(-1)}'`
      });
      print[funcName](printText);
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
    if (p[0] == ".") {
      p = path.join(path.dirname(InStaticPath), p);
    }
    else if (p[0] == "/") {
      p = p.substring(1);
    } else {
      return AliasOrPackage(p);
    }
    return LoadImport([...importFrom, SavedModulesPath], p, typeArray, { isDebug, useDeps, withoutCache: inheritanceCache ? withoutCache : [] });
  }

  let MyModule: any;
  if (thisCustom) {
    MyModule = await CustomImport(originalPath, filePath, extension, requireMap);
  } else {
    const requirePath = path.join(typeArray[1], InStaticPath + ".cjs");
    MyModule = ImportWithoutCache(requirePath);

    if (onlyPrepare) { // only prepare the module without actively importing it
      PrepareMap[SavedModulesPath] = () => MyModule(requireMap);
      return;
    }

    try {
      MyModule = await MyModule(requireMap);
    }
    catch (err) {
      const [funcName, printText] = createNewPrint({
        type: 'error',
        errorName: 'import-error',
        text: `${err.message}<color>${importFrom.concat(filePath).reverse().join(' ->\n')}`
      });
      print[funcName](printText);
    }
  }

  //in case on an error - release the async
  SavedModules[SavedModulesPath] = MyModule;
  processEnd?.();


  return MyModule;
}

export async function ImportFile(importFrom: string, InStaticPath: string, typeArray: string[], isDebug = false, useDeps?: StringAnyMap, withoutCache?: string[]) {
  if (!isDebug) {
    const SavedModulesPath = path.join(typeArray[2], InStaticPath.toLowerCase());
    const haveImport = SavedModules[SavedModulesPath];

    if (haveImport != undefined)
      return haveImport;
    else if (PrepareMap[SavedModulesPath]) {
      const module = await PrepareMap[SavedModulesPath]();
      SavedModules[SavedModulesPath] = module;
      return module;
    }
  }

  return LoadImport([importFrom], InStaticPath, typeArray, { isDebug, useDeps, withoutCache });
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
export async function compileImport(globalPrams: string, scriptLocation: string, inStaticLocationRelative: string, typeArray: string[], isTypeScript: boolean, isDebug: boolean, mergeTrack?: StringTracker) {
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
    if (p[0] == ".") {
      p = path.join(path.dirname(inStaticLocationRelative), p);
    }
    else if (p[0] == "/"){
      p = p.substring(1)
    }
    else {
      return AliasOrPackage(p);
    }

    return LoadImport([templatePath], p, getTypes.Static, { isDebug });
  }

  const MyModule = await ImportWithoutCache(fullSaveLocation);
  return async (...arr: any[]) => await MyModule(requireMap, ...arr);
}

/**
 * `ImportOnce` is a function that takes a path to a file in the project directory, a boolean that
 * determines if the file is TypeScript or JavaScript, a string that contains global parameters to be
 * passed to the compiler, and a boolean that determines if the compiler should be run in debug mode
 * @param {string} pathInProjectDirectory - The path to the file you want to import.
 * @param {boolean} isTypeScript - If the file is a TypeScript file, set this to true.
 * @param [globalPrams] - This is a string of parameters that will be passed to the compiler.
 * @param [isDebug=true] - For the global variable 'debug'
 * @returns The return value is a promise that resolves to the value of the last expression evaluated
 * in the function.
 */
export async function ImportFromWorkingDirectory(fullPath: string, isTypeScript: boolean, globalPrams = "", isDebug = true) {
  const relative = path.relative(BasicSettings.fullWebSitePath, fullPath)
  await EasyFs.makePathReal(relative, SystemData + '/');

  const fullSaveLocation = path.join(SystemData, `temp-${uuid()}.cjs`);


  await BuildScript(
    fullPath,
    fullSaveLocation,
    isTypeScript,
    isDebug,
    { params: globalPrams, codeMinify: false }
  );

  function requireMap(p: string) {
    if (path.isAbsolute(p))
      p = path.join('..', p);
    else {
      if (p[0] == ".") {
        p = path.relative(getTypes.Static[0], path.join(path.dirname(fullPath), p));

      }
      else if (p[0] != "/"){
        return AliasOrPackage(p);
      }
    }

    return LoadImport([relative], p, getTypes.Static, { isDebug });
  }

  const MyModule = await ImportWithoutCache(fullSaveLocation);
  EasyFs.unlink(fullSaveLocation);

  return async (...arr: any[]) => await MyModule(requireMap, ...arr);
}