import StringTracker from '../EasyDebug/StringTracker';
import { SourceMapGenerator } from "source-map-js";
import path from 'path';
import { finalizeBuild } from '../BuildInComponents/index';
import JSParser from './JSParser';
import { SourceMapBasic } from '../EasyDebug/SourceMapStore';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';
import { SessionBuild } from './Session';

class createPageSourceMap extends SourceMapBasic {
    constructor(filePath: string) {
        super(filePath, false);
    }

    addMappingFromTrack(track: StringTracker) {
        const DataArray = track.getDataArray(), length = DataArray.length;
        let waitNextLine = true;

        for (let index = 0; index < length; index++) {
            const { text, line, info } = DataArray[index];

            if (text == '\n') {
                this.lineCount++;
                waitNextLine = false;
                continue;
            }

            if (!waitNextLine && line && info) {
                waitNextLine = true;
                this.map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: this.lineCount, column: 0 },
                    source: this.getSource(info)
                });
            }
        }

    }
}

export class PageTemplate extends JSParser {

    private static CreateSourceMap(text: StringTracker, filePath: string): string {
        const storeMap = new createPageSourceMap(filePath);
        storeMap.addMappingFromTrack(text);

        return storeMap.mapAsURLComment();
    }

    private static async AddPageTemplate(text: StringTracker, isDebug: boolean, fullPath: string, fullPathCompile: string, sessionInfo: SessionBuild) {

        text = await finalizeBuild(text, sessionInfo, fullPathCompile);

        if (isDebug) {
            text.AddTextBeforeNoTrack(`try {\n`);
        }

        text.AddTextBeforeNoTrack(`
        module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "${JSParser.fixTextSimpleQuotes(fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path.dirname(fullPath))}";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {`);



        if (isDebug) {
            text.AddTextAfterNoTrack(`\n}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\\n( )*at /)[2];
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }`);
        }

        text.AddTextAfterNoTrack(`}});}`);

        if (isDebug) {
            text.Plus(PageTemplate.CreateSourceMap(text, fullPathCompile));
        }

        return text;
    }

    static async BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: SessionBuild) {
        const builtCode = await PageTemplate.RunAndExport(text, path, isDebug);

        return PageTemplate.AddPageTemplate(builtCode, isDebug, path, fullPathCompile, sessionInfo);
    }

    static AddAfterBuild(text: string, isDebug: boolean) {
        if (isDebug) {
            text = "require('source-map-support').install();" + text;
        }
        return text;
    }

    static InPageTemplate(text: StringTracker, dataObject: any, fullPath: string) {
        text.AddTextBeforeNoTrack(`<%!{
            const _page = page;
            {
            const page = {..._page${dataObject ? ',' + dataObject : ''}};
            const __filename = "${JSParser.fixTextSimpleQuotes(fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path.dirname(fullPath))}";
            const require = (p) => _require(__filename, __dirname, page, p);
            const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
            const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {%>`);

        text.AddTextAfterNoTrack('<%!}}}%>');

        return text;
    }
}
