import StringTracker from '../EasyDebug/StringTracker';
import { SourceMapGenerator } from "source-map-js";
import path from 'path';
import { finalizeBuild } from '../BuildInComponents/index';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
import JSParser from './JSParser';

export class PageTemplate extends JSParser {

    private static CreateSourceMap(text: StringTracker, filePath: string): string {
        const map = new SourceMapGenerator({
            file: filePath.split(/\/|\\/).pop()
        });

        const thisDirFile = path.dirname(filePath);

        const DataArray = text.getDataArray(), length = DataArray.length;

        let lineCount = 0;
        for (let index = 1, element = DataArray[index]; index < length; index++, element = DataArray[index]) {

            if (element.text == '\n') {
                lineCount++;
                continue;
            }

            if (!lineCount) {
                continue;
            }

            const { line, info } = element;

            if (line && info) {
                map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: lineCount, column: 0 },
                    source: path.relative(thisDirFile, info.split('<line>').pop().trim()).replace(/\\/gi, '/')
                });
            }
        }

        return "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(map.toString()).toString("base64");
    }

    private static async AddPageTemplate(text: StringTracker, isDebug: boolean, fullPathCompile: string, sessionInfo: StringAnyMap) {

        text = await finalizeBuild(text, sessionInfo, fullPathCompile);

        if (isDebug) {
            text.AddTextBefore(`try {\n`);
        }


        text.AddTextBefore(`
        export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, RequireVar} = page,
                    
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

    static BuildPage(text: StringTracker, path: string, isDebug: boolean, fullPathCompile: string, sessionInfo: StringAnyMap) {
        const builtCode = PageTemplate.RunAndExport(text, path, isDebug);

        return PageTemplate.AddPageTemplate(builtCode, isDebug, fullPathCompile, sessionInfo);
    }

    static AddAfterBuild(text: string, isDebug: boolean) {
        if (isDebug) {
            text = "import sourceMapSupport from 'source-map-support'; sourceMapSupport.install({hookRequire: true});" + text;
        }
        return text;
    }
}
