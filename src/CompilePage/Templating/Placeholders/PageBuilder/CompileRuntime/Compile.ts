import path from "node:path";
import { FileImporter } from "../../../../../ImportSystem/Loader";
import STBuilder from "../../../../../ImportSystem/Loader/Builders/STBuilder";
import { SystemError } from "../../../../../Logger/ErrorLogger";
import { GlobalSettings } from "../../../../../Settings/GlobalSettings";
import PPath from "../../../../../Settings/PPath";
import { StringAnyMap } from "../../../../../Settings/types";
import StringTracker from "../../../../../SourceTracker/StringTracker/StringTracker";
import { hashString } from "../../../../../Util/Strings";
import { SessionBuild } from "../../../../Session";
import EJSParser from "../../../EJSPArser";
import { ConvertSyntaxCompile } from "../../../RazorTranspiler";
import exportContext, { RuntimeContext } from "./ExportContext";
import { templateScript } from "./ExportContext/STWriter";

const COMPILE_EXTENSION = '.compile.js';

export const CacheCompileScript = new Map();
export default class CRunTime {
    define = {}
    hash = '';

    constructor(public script: StringTracker, public sessionInfo: SessionBuild, public sourceFile: PPath) {
        this.hash = hashString(script.eq);
    }
    /**
     * It takes a moduleScriptFunc, and returns a function that create the compile HTML
     * @param {any} moduleScriptFunc - This is the scripts module function.
     * @returns A function that takes funcs and writerArray and returns the compiled HTML.
     */
    private createHandelScriptBuild(moduleScriptFunc: any) {
        return async ({ funcs, result, define }: RuntimeContext) => {
            this.define = define
            try {
                await moduleScriptFunc(...funcs);
                return result;
            } catch (err) {
                SystemError('compile-runtime-error', err, true)
            }
        }
    }

    private createScriptWait() {
        // make all users of the script wait for it to finish
        let doForAll: (resolve: (data: RuntimeContext) => StringTracker | Promise<StringTracker>) => void;

        // temp promise to wait for the script to finish
        const dataCache = { hash: this.hash, func: new Promise(r => doForAll = r), parser: null };
        CacheCompileScript.set(this.sourceFile.small, dataCache);

        // resolve the promise, and update the cache, this async so it will appends after the return of 'compileScript' function
        return async (func: any, parser?: EJSParser) => {
            dataCache.func = func;
            dataCache.parser = parser
            doForAll(func);
        }

    }

    private async compileScript(compileWait: (func: any, parser?: EJSParser) => void) {
        const parser = await ConvertSyntaxCompile(this.script);

        // if there isn't any code, just return as is
        if (parser.values.length == 1 && parser.values[0].type === 'text') {
            compileWait(() => parser.values[0].text);
            return;
        }

        // create paths for the script
        const compileFile = this.sourceFile.clone()
        compileFile.nested += COMPILE_EXTENSION

        // create the script by template
        const scriptWithTemplate = templateScript(parser);

        // compiling and importing the script
        const scriptBuilder = new STBuilder(scriptWithTemplate, GlobalSettings.compile.typescript)
        const moduleScriptFunc = await new FileImporter(this.sourceFile, { builder: scriptBuilder, importLine: this.sourceFile.small, exportFile: compileFile, skipCache: ['recompile-file', 'skip-loading', 'skip-write-tree'] }).createImport();
        const handelScriptBuild = this.createHandelScriptBuild(moduleScriptFunc);

        // resolve the script builder, for all the users
        compileWait(handelScriptBuild, parser);

    }

    private async compileFromCache(attributes?: StringAnyMap, importSource?: PPath) {
        const cacheCompile = CacheCompileScript.get(this.sourceFile.small);
        const func = await cacheCompile.func

        if (cacheCompile?.hash == this.hash) {
            return func(
                exportContext(
                    this.sessionInfo,
                    cacheCompile.parser,
                    attributes,
                    importSource
                )
            );
        }
        return false;
    }

    async compile(attributes?: StringAnyMap, importSource?: PPath): Promise<StringTracker> {
        // load from cache
        let cache = await this.compileFromCache(attributes, importSource);
        if (cache) return cache;

        // make all users of the script wait for it to finish
        const compileWait = this.createScriptWait();
        cache = this.compileFromCache(attributes); // add this to the wait list

        await this.compileScript(compileWait);
        return cache;
    }
}