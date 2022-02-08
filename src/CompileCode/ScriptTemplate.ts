import StringTracker from '../EasyDebug/StringTracker';
import { SourceMapGenerator } from "source-map-js";
import path from 'path';
import { finalizeBuild } from '../BuildInComponents/index';
import { SessionInfo } from '../CompileCode/XMLHelpers/CompileTypes';
import JSParser from './JSParser';
import { SourceMapBasic } from '../EasyDebug/SourceMapStore';

class createPageSourceMap extends SourceMapBasic {
    constructor(filePath: string) {
        super(filePath, false);
    }

    addMappingFromTrack(track: StringTracker) {
        const DataArray = track.getDataArray(), length = DataArray.length;
        let waitNextLine = true;

        for (let index = 0; index < length; index++) {
            const { text, line, info } = DataArray[index];

            if (text == '\n' && !(waitNextLine = false) && ++this.lineCount || waitNextLine)
                continue;

            if (line && info && (waitNextLine = true))
                this.map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: this.lineCount, column: 0 },
                    source: this.getSource(info)
                });
        }
    }
}

export class PageTemplate extends JSParser {

    private static CreateSourceMap(text: StringTracker, filePath: string): string {
        const storeMap = new createPageSourceMap(filePath);
        storeMap.addMappingFromTrack(text);

        return storeMap.mapAsURLComment();
    }

    private static async AddPageTemplate(text: StringTracker, isDebug: boolean, fullPathCompile: string, sessionInfo: SessionInfo) {

        text = await finalizeBuild(text, sessionInfo, fullPathCompile);

        if (isDebug) {
            text.AddTextBefore(`try {\n`);
        }


        text.AddTextBefore(`
        module.exports = (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, RequestVar} = page,
                    
                    run_script_code = run_script_name; 

                {`);



        if (isDebug) {
            text.AddTextAfter(`\n}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\\n( )*at /)[2];
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }`);
        }

        text.AddTextAfter(`}});}`);

        if (isDebug) {
            text.Plus(PageTemplate.CreateSourceMap(text, fullPathCompile));
        }

        return text;
    }

    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: SessionInfo) {
        const builtCode = PageTemplate.RunAndExport(text, path, isDebug);

        return PageTemplate.AddPageTemplate(builtCode, isDebug, fullPathCompile, sessionInfo);
    }

    static AddAfterBuild(text: string, isDebug: boolean) {
        if (isDebug) {
            text = "require('source-map-support').install();" + text;
        }
        return text;
    }
}
