import path from "path";
import StringTracker from "../../EasyDebug/StringTracker";
import compileImport from "../../ImportFiles/compileImport";
import { print } from "../../OutputInput/Console";
import EasyFs from "../../OutputInput/EasyFs";
import { createNewPrint } from "../../OutputInput/Logger";
import { ConvertSyntaxCompile, ConvertSyntaxMini } from "../../Plugins/Syntax/RazorSyntax";
import createDateWriter from "../../RunTimeBuild/DataWriter";
import { getTypes, smallPathToPage, BasicSettings } from "../../RunTimeBuild/SearchFileSystem";
import { hashString } from "../../StringMethods/Id";
import { SplitFirst } from "../../StringMethods/Splitting";
import { SPECIAL_ATTRIBUTES } from "../InsertComponent";
import JSParser from "../JSParser";
import { SessionBuild } from "../Session";
import { StringAnyMap } from "../XMLHelpers/CompileTypes";

export const CacheCompileScript = new Map();
export default class CRunTime {
    define = {}
    hash = '';

    constructor(public script: StringTracker, public sessionInfo: SessionBuild, public smallPath: string, public isTs: boolean) {
        this.hash = hashString(script.eq);
    }

    /**
     * It takes a list of scripts, and for each script, it creates a new writer, and then add the script
     * @param {StringTracker[]} scripts - An array of StringTrackers. Each StringTracker is a script.
     * @returns the build variable.
     */
    private templateScript(scripts: StringTracker[]) {
        const build = new StringTracker();
        build.AddTextAfterNoTrack(`var __write;`)

        for (const i of scripts) {
            build.AddTextAfterNoTrack(`\n__write = {text: ''};var {write, writeSafe, echo} = createDateWriter(__write);`)
            build.Plus(i)
        }

        return build;
    }

    /**
     * It takes an object, and returns a string of the object's key-value pairs, formatted as HTML
     * attributes
     * @param {StringAnyMap} attributes - The attributes to render.
     * @param {string[] | null} onlySome - This is an array of strings that are the only attributes you
     * want to render.
     * @param {boolean} [asObject] - If true, the attributes will be rendered as an object.
     * @returns A string of attributes
     */
    private renderAttrs(attributes: StringAnyMap, onlySome: string[] | null, asObject?: boolean): string {
        const values = [];
        for (const [key, value] of Object.entries(attributes)) {
            if (SPECIAL_ATTRIBUTES.includes(key) || onlySome.length && !onlySome.includes(key)) {
                continue;
            }

            if (typeof value === 'boolean' || value == null) {
                if (value) {
                    values.push(key)
                }
                continue
            }

            if (typeof value == 'string') {
                values.push(`${key}=${JSON.stringify(value)}`);
            } else if (asObject) {
                values.push(`${key}=(${JSON.stringify(value)})`);
            } else {
                values.push(`${key}="${JSON.stringify(value).replaceAll('"', '&#34;')}"`);
            }
        }

        return values.join(' ');
    }

    /**
     * Create the methods for the compile script
     * @param attributes - attributes of the component
     * @param writerArray - array of {text: string} for rebuilding the script later
     * @returns 
     */
    private methods(attributes: StringAnyMap = {}, writerArray = []) {
        const __localpath = '/' + smallPathToPage(this.sessionInfo.smallPath);
        return {
            writerArray,
            string: 'script,style,define,store,page__filename,page__dirname,__localpath,attrs,dependence,attrsHTML,attrsObjectHTML,createDateWriter,attrdefault',
            funcs: [
                this.sessionInfo.script.bind(this.sessionInfo), // script
                this.sessionInfo.style.bind(this.sessionInfo), // style
                (key: any, value: any) => this.define[String(key)] = value, // define
                this.sessionInfo.compileRunTimeStore, // store
                this.sessionInfo.fullPath, // page__filename
                path.dirname(this.sessionInfo.fullPath), // page__dirname
                __localpath, // __localpath
                attributes, // attrs
                (filePath: string) => { // dependence
                    if (path.isAbsolute(filePath)) {
                        filePath = path.join(getTypes.Static[2], filePath);
                    } else {
                        filePath = path.join(this.script.extractInfo(), '..', filePath);
                    }
                    return this.sessionInfo.dependence(filePath)
                },
                (attrs: StringAnyMap = attributes, ...onlySome: string[]) => { // attrsHTML
                    if (typeof attrs == 'string') {
                        onlySome.unshift(attrs);
                        attrs = attributes;
                    }
                    return this.renderAttrs(attrs, onlySome);
                },
                (attrs: StringAnyMap = attributes, ...onlySome: string[]) => { // attrsObjectHTML
                    if (typeof attrs == 'string') {
                        onlySome.unshift(attrs);
                        attrs = attributes;
                    }
                    return this.renderAttrs(attrs, onlySome, true);
                },
                (data: { text: string }) => { // createDateWriter
                    writerArray.unshift(data);
                    return createDateWriter(data, this.sessionInfo.debug)
                },
                (keys: string | string[], value: any) => { // attrdefault
                    if (!Array.isArray(keys)) {
                        keys = [keys];
                    }

                    for (const key of keys) {
                        attributes[key] ??= value;
                    }
                }
            ]
        }
    }

    private rebuildCode(parser: JSParser, writerArray: { text: string }[]) {
        const build = new StringTracker();

        for (const i of parser.values) {
            if (i.type == 'text') {
                build.Plus(i.text)
                continue
            }

            build.AddTextAfterNoTrack(writerArray.pop().text, i.text.DefaultInfoText.info);
        }

        return build;
    }

    /**
     * It takes a parser and a moduleScriptFunc, and returns a function that create the compile HTML
     * @param {JSParser} parser - JSParser - this is the parser that will be used to rebuild the code.
     * @param {any} moduleScriptFunc - This is the scripts module function.
     * @returns A function that takes funcs and writerArray and returns the compiled HTML.
     */
    private createHandelScriptBuild(parser: JSParser, moduleScriptFunc: any) {
        return async ({ funcs, writerArray }: { funcs: any[], writerArray: { text: string }[] }) => {
            try {
                await moduleScriptFunc(...funcs);
                return this.rebuildCode(parser, writerArray);
            } catch (err) {
                const [funcName, printText] = createNewPrint({
                    errorName: 'compile-runtime-error',
                    text: err.stack,
                    type: 'error'
                });
                print[funcName](printText);
            }
        }
    }

    private createScriptWait() {
        // make all users of the script wait for it to finish
        let doForAll: (resolve: ({ funcs, writerArray }: { funcs: any[], writerArray: { text: string }[] }) => StringTracker | Promise<StringTracker>) => void;

        // temp promise to wait for the script to finish
        const dataCache = { hash: this.hash, func: new Promise(r => doForAll = r) };
        CacheCompileScript.set(this.smallPath, dataCache);

        // resolve the promise, and update the cache, this async so it will appends after the return of 'compileScript' function
        return async (func: any) => {
            dataCache.func = func;
            doForAll(func);
        }

    }

    private async compileScript(compileWait: (data: any) => any) {
        const parser = await ConvertSyntaxCompile(this.script, this.smallPath);

        // if there isn't any code, just return as is
        if (parser.values.length == 1 && parser.values[0].type === 'text') {
            compileWait(() => this.script);
            return;
        }

        // create paths for the script
        const [type, filePath] = SplitFirst('/', this.smallPath);
        const typeArray = getTypes[type], compilePath = typeArray[1] + filePath + '.comp.js';
        await EasyFs.makePathReal(filePath, typeArray[1]);

        // create the script by template
        const template = this.templateScript(parser.values.filter(x => x.type != 'text').map(x => x.text));
        const { string } = this.methods() // create methods

        // compiling and importing the script
        const moduleScriptFunc = await compileImport(string, compilePath, filePath, typeArray, this.isTs, this.sessionInfo, template);
        const handelScriptBuild = this.createHandelScriptBuild(parser, moduleScriptFunc);

        // resolve the script builder, for all the users
        compileWait(handelScriptBuild);

    }

    private async compileFromCache(attributes?: StringAnyMap) {
        const cacheCompile = CacheCompileScript.get(this.smallPath);

        if (cacheCompile?.hash == this.hash)
            return (await cacheCompile.func)(this.methods(attributes));
        return false;
    }

    async compile(attributes?: StringAnyMap): Promise<StringTracker> {
        // load from cache
        let cache = await this.compileFromCache(attributes);
        if (cache) return cache;

        // make all users of the script wait for it to finish
        const compileWait = this.createScriptWait();
        cache = this.compileFromCache(attributes); // add this to the wait list

        await this.compileScript(compileWait);
        return cache;
    }
}