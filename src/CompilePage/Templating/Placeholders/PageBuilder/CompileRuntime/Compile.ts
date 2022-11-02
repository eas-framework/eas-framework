import {FileImporter} from "../../../../../ImportSystem/Loader/index.js";
import STBuilder from "../../../../../ImportSystem/Loader/Builders/STBuilder.js";
import {SystemError} from "../../../../../Logger/ErrorLogger.js";
import {GlobalSettings} from "../../../../../Settings/GlobalSettings.js";
import PPath from "../../../../../Settings/PPath.js";
import {StringAnyMap} from "../../../../../Settings/types.js";
import StringTracker from "../../../../../SourceTracker/StringTracker/StringTracker.js";
import {hashString} from "../../../../../Util/Strings.js";
import {SessionBuild} from "../../../../Session.js";
import EJSParser from "../../../EJSParser.js";
import {ConvertSyntaxCompile} from "../../../RazorTranspiler.js";
import exportContext, {RuntimeContext} from "./ExportContext/index.js";
import {compileRuntimeScriptBuilder, compileRuntimeTemplateScript} from "./ExportContext/STWriter.js";
import DepCreator from '../../../../../ImportSystem/Dependencies/DepCreator.js';

const COMPILE_EXTENSION = '.compile.cjs';

export const CacheCompileScript = new Map();
export default class CRunTime {
    define = {};
    hash = '';

    constructor(public script: StringTracker, public sessionInfo: SessionBuild, public sourceFile: PPath) {
        this.hash = hashString(script.eq);
    }

    /**
     * It takes a moduleScriptFunc, and returns a function that create the compiled HTML
     * @param {any} moduleScriptFunc - This is the scripts module function.
     * @returns A function that takes funcs and writerArray and returns the compiled HTML.
     */
    private createHandelScriptBuild(moduleScriptFunc: any) {
        return async ({funcs, result, define}: RuntimeContext) => {
            this.define = define;
            try {
                await moduleScriptFunc(...funcs);
                return result;
            } catch (err) {
                SystemError('compile-runtime-error', err, true);
            }
        };
    }

    private createScriptWait() {
        // make all users of the script wait for it to finish
        let doForAll: (resolve: (data: RuntimeContext) => StringTracker | Promise<StringTracker>) => void;

        // temp promise to wait for the script to finish
        const dataCache = {hash: this.hash, func: new Promise(r => doForAll = r), deps: null, parser: null};
        CacheCompileScript.set(this.sourceFile.small, dataCache);

        // resolve the promise, and update the cache, this async, so it will append after the return of 'compileScript' function
        return async (func: any, parser?: EJSParser, depSession?: DepCreator) => {
            dataCache.func = func;
            dataCache.parser = parser;
            dataCache.deps = depSession;
            doForAll(func);
        };

    }

    private async compileScript(compileWait: (func: any, parser?: EJSParser, depSession?: DepCreator) => void) {
        const parser = await ConvertSyntaxCompile(this.script);

        // if there isn't any code, just return as is
        if (parser.values.length <= 1 && parser.values[0].type === 'text') {
            compileWait(() => parser.values[0]?.text ?? new StringTracker());
            return;
        }

        // create paths for the script
        const compileFile = this.sourceFile.clone();
        compileFile.nested += COMPILE_EXTENSION;

        // convert the parser to StringTracker
        const builtCompileScript = compileRuntimeScriptBuilder(parser);

        // compiling and importing the script
        const scriptBuilder = new STBuilder(builtCompileScript, {
            typeScriptAlwaysTrue: GlobalSettings.compile.typescript,
            template: compileRuntimeTemplateScript
        });
        const moduleScriptFunc = new FileImporter(this.sourceFile, {
            builder: scriptBuilder,
            importLine: this.sourceFile.small,
            exportFile: compileFile,
            skipCache: ['recompile-file', 'skip-loading', 'skip-write-tree-on-build']
        });
        const handelScriptBuild = this.createHandelScriptBuild(await moduleScriptFunc.createImport());

        // resolve the script builder, for all the users
        compileWait(handelScriptBuild, parser, moduleScriptFunc.session);

    }

    private async compileFromCache(attributes?: StringAnyMap, importSource?: PPath) {
        const cacheCompile = CacheCompileScript.get(this.sourceFile.small);
        const func = await cacheCompile?.func;

        if (cacheCompile?.hash == this.hash) {

            if (cacheCompile.deps) {
                await this.sessionInfo.dependencies.mergeDep(cacheCompile.deps);
            }

            return func(
                cacheCompile.parser && // if there is no parser that means it is a fixed string tracker
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