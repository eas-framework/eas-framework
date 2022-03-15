import SourceMapStore from "../../EasyDebug/SourceMapStore";
import StringTracker from "../../EasyDebug/StringTracker";
import { paramsImport } from "../../ImportFiles/Script";
import EasyFs from "../../OutputInput/EasyFs";
import { ConvertSyntaxMini } from "../../Plugins/Syntax/RazorSyntax";
import { BasicSettings, getTypes } from "../../RunTimeBuild/SearchFileSystem";
import { SplitFirst } from "../../StringMethods/Splitting";
import JSParser from "../JSParser";
import { SessionBuild } from "../Session";

export default class CRunTime {
    define = {}
    constructor(public script: StringTracker, public sessionInfo: SessionBuild, public smallPath: string, public debug: boolean, public isTs: boolean){

    }

    private templateScript(scripts: StringTracker[]){
        const build = new StringTracker();
        build.AddTextAfterNoTrack(`const __writeArray = []
        var __write;

        function write(text){
            __write.text += text;
        }`)

        for(const i of scripts){
            build.AddTextAfterNoTrack(`__write = {text: ''};
            __writeArray.push(__write);`)
            build.Plus(i)
        }

        build.AddTextAfterNoTrack(`return __writeArray`);
        return build;
    }

    private methods(){
        return {
            string: 'script,style,define,store',
            funcs: [
                this.sessionInfo.script.bind(this.sessionInfo),
                this.sessionInfo.style.bind(this.sessionInfo),
                (key: any, value: any) => this.define[String(key)] = value,
                this.sessionInfo.compileRunTimeStore
            ]
        }
    }

    async compile(){
        this.script = await ConvertSyntaxMini(this.script, "@compile", "*");
        const parser = new JSParser(this.script, this.smallPath, '<%*', '%>');
        await parser.findScripts();

        if(parser.values.length == 1 && parser.values[0].type === 'text') return this.script;

        const [type, filePath] =SplitFirst('/', this.smallPath), typeArray = getTypes[type] ?? getTypes.Static, 
        compilePath = typeArray[1] + filePath + '.comp.js',
        inStaticPath = BasicSettings.fullWebSitePath + this.smallPath;

        const template = this.templateScript(parser.values.filter(x => x.type != 'text').map(x => x.text));
        const sourceMap = new SourceMapStore(compilePath, this.debug, false, false)
        sourceMap.addStringTracker(template);
        const {funcs, string} = this.methods()

        const toImport = await paramsImport(string,compilePath, inStaticPath, typeArray, this.isTs, this.debug, template.eq, sourceMap.mapAsURLComment());
        const buildStrings: {text: string}[] = await toImport(...funcs);
        

        const build = new StringTracker();

        for(const i of parser.values){
            if(i.type == 'text'){
                build.Plus(i.text)
                continue
            }

            build.AddTextAfterNoTrack(buildStrings.pop().text)
        }

        return build;
    }
}