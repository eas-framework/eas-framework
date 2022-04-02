import path from "path";
import SourceMapStore from "../../EasyDebug/SourceMapStore";
import StringTracker from "../../EasyDebug/StringTracker";
import { compileImport } from "../../ImportFiles/Script";
import { print } from "../../OutputInput/Console";
import EasyFs from "../../OutputInput/EasyFs";
import { createNewPrint } from "../../OutputInput/PrintNew";
import { ConvertSyntaxMini } from "../../Plugins/Syntax/RazorSyntax";
import { BasicSettings, getTypes, smallPathToPage } from "../../RunTimeBuild/SearchFileSystem";
import { CutTheLast, SplitFirst } from "../../StringMethods/Splitting";
import JSParser from "../JSParser";
import { SessionBuild } from "../Session";
import { StringAnyMap } from "../XMLHelpers/CompileTypes";

export default class CRunTime {
    define = {}
    constructor(public script: StringTracker, public sessionInfo: SessionBuild, public smallPath: string, public isTs: boolean) {

    }

    private templateScript(scripts: StringTracker[]) {
        const build = new StringTracker();
        build.AddTextAfterNoTrack(`const __writeArray = []
        var __write;

        function write(text){
            __write.text += text;
        }`)

        for (const i of scripts) {
            build.AddTextAfterNoTrack(`\n__write = {text: ''};__writeArray.unshift(__write);`)
            build.Plus(i)
        }

        build.AddTextAfterNoTrack(`\nreturn __writeArray`);
        return build;
    }

    private methods(attributes?: StringAnyMap) {
        const __localpath = '/' + smallPathToPage(this.sessionInfo.smallPath);
        return {
            string: 'script,style,define,store,page__filename,page__dirname,__localpath,attributes',
            funcs: [
                this.sessionInfo.script.bind(this.sessionInfo),
                this.sessionInfo.style.bind(this.sessionInfo),
                (key: any, value: any) => this.define[String(key)] = value,
                this.sessionInfo.compileRunTimeStore,
                this.sessionInfo.fullPath,
                path.dirname(this.sessionInfo.fullPath),
                __localpath,
                attributes || {}
            ]
        }
    }

    private rebuildCode(parser: JSParser, buildStrings: { text: string }[]) {
        const build = new StringTracker();

        for (const i of parser.values) {
            if (i.type == 'text') {
                build.Plus(i.text)
                continue
            }

            build.AddTextAfterNoTrack(buildStrings.pop().text, i.text.DefaultInfoText.info);
        }

        return build;
    }

    async compile(attributes?: StringAnyMap): Promise<StringTracker> {
        /* load from cache */
        const haveCache = this.sessionInfo.cacheCompileScript[this.smallPath];
        if (haveCache)
            return (await haveCache)();
        let doForAll: (resolve: () => StringTracker | Promise<StringTracker>) => void;
        this.sessionInfo.cacheCompileScript[this.smallPath] = new Promise(r => doForAll = r);

        /* run the script */
        this.script = await ConvertSyntaxMini(this.script, "@compile", "*");
        const parser = new JSParser(this.script, this.smallPath, '<%*', '%>');
        await parser.findScripts();

        if (parser.values.length == 1 && parser.values[0].type === 'text') {
            const resolve = () => this.script;
            doForAll(resolve);
            this.sessionInfo.cacheCompileScript[this.smallPath] = resolve;
            return this.script;
        }

        const [type, filePath] = SplitFirst('/', this.smallPath), typeArray = getTypes[type] ?? getTypes.Static,
            compilePath = typeArray[1] + filePath + '.comp.js';
        await EasyFs.makePathReal(filePath, typeArray[1]);

        const template = this.templateScript(parser.values.filter(x => x.type != 'text').map(x => x.text));
        const { funcs, string } = this.methods(attributes)

        const toImport = await compileImport(string, compilePath, filePath, typeArray, this.isTs, this.sessionInfo.debug, template);

        const execute = async () => {
            try {
                return this.rebuildCode(parser, await toImport(...funcs));
            } catch(err){
                const [funcName, printText] = createNewPrint({
                    errorName: err,
                    text: err.message,
                    type: 'error'
                });
                print[funcName](printText);
            }
        };
        this.sessionInfo.cacheCompileScript[this.smallPath] = execute; // save this to cache
        const thisFirst = await execute();
        doForAll(execute)

        return thisFirst;
    }
}