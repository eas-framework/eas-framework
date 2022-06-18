import path from "path";
import EasyFs from "../OutputInput/EasyFs";
import { AliasOrPackage } from "./CustomImport/Alias";
import LoadImport, { BuildScript } from "./Script";
import ImportWithoutCache from './redirectCJS';
import RequireFile from "../RunTimeBuild/ImportFileRuntime";
import { getTypes } from "../RunTimeBuild/SearchFileSystem";
import StringTracker from "../EasyDebug/StringTracker";
import { SessionBuild } from "../CompileCode/Session";


let depsCompileCache = {}

export function deleteCompileRuntimeDepsCache(){
    depsCompileCache = {}
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
 * @param {SessionBuild} sessionInfo - the current session information
 * @param {string} fileCode - The code that will be compiled and saved to the file.
 * @param {string} sourceMapComment - string
 * @returns A function that returns a promise.
 */



/**
 * It compiles a script, and then returns a function that can be called to run the script
 * This is for RunTime Compile Scripts
 * @param {string} globalPrams - params split with comma,
 * @param {string} scriptLocation - The location to save the compiled script
 * @param {string} inStaticLocationRelative - This is the location of the template relative to the
 * static folder.
 * @param {string[]} typeArray - This is the type of file you're compiling - Static, Log, Model...
 * @param {boolean} isTypeScript - If the file is a typescript file or not.
 * @param {SessionBuild} sessionInfo - SessionBuild
 * @param {StringTracker} [mergeTrack] - This is a StringTracker object that is used to track the
 * strings that are used in the template. This is used to make sure that the strings tracking information are saved
 * @returns A function that will run the compiled script.
 */
export default async function compileImport(globalPrams: string, scriptLocation: string, inStaticLocationRelative: string, typeArray: string[], isTypeScript: boolean, sessionInfo: SessionBuild, mergeTrack?: StringTracker) {
    await EasyFs.makePathReal(inStaticLocationRelative, typeArray[1]);

    const fullSaveLocation = scriptLocation + ".cjs";
    const templatePath = typeArray[0] + inStaticLocationRelative;

    await BuildScript(
        scriptLocation,
        fullSaveLocation,
        isTypeScript,
        sessionInfo.debug,
        { params: globalPrams, mergeTrack, templatePath, codeMinify: false }
    );

    depsCompileCache[templatePath] ??= {};
    const deps = depsCompileCache[templatePath];

    function requireMap(filePath: string) {
        return RequireFile(filePath, templatePath, '', typeArray, deps, sessionInfo.debug)
    }

    const MyModule = await ImportWithoutCache(fullSaveLocation);
    return async (...arr: any[]) => await MyModule(requireMap, ...arr);
}