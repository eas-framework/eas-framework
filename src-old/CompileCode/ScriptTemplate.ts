import StringTracker from '../EasyDebug/StringTracker';
import path from 'path';
import { finalizeBuild } from '../BuildInComponents/index';
import JSParser from './JSParser';
import { SessionBuild } from './Session';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';


export class PageTemplate extends JSParser {

    private static async AddPageTemplate(text: StringTracker, sessionInfo: SessionBuild) {

        if (sessionInfo.debug) {
            text.AddTextBeforeNoTrack(`try {\n`);
        }

        text.AddTextBeforeNoTrack(`
        module.exports = (_require, _include, _transfer, private_var, handelConnector) => {
            return (async function (page) {
                const __filename = "${JSParser.fixTextSimpleQuotes(sessionInfo.fullPath)}", __dirname = "${JSParser.fixTextSimpleQuotes(path.dirname(sessionInfo.fullPath))}";
                const require = (p) => _require(__filename, __dirname, page, p);
                const include = (p, withObject) => _include(__filename, __dirname, page, p, withObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page,

                    run_script_code = run_script_name;

                    const transfer = (p, preserveForm, withObject) => (out_run_script = {text: ''}, _transfer(p, preserveForm, withObject, __filename, __dirname, page));
                {`);



        if (sessionInfo.debug) {
            text.AddTextAfterNoTrack(`\n}
                catch(e){
                    const last_file = run_script_name.split(/->|<line>/).pop();
                    run_script_name += ' -> <line>' + e.stack.split(/\\n( )*at /)[2];
                    out_run_script.text += '${PageTemplate.printError(`<p>Error path: ' + run_script_name.replace(/<(line|color)>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p>`)}';
        
                    console.error("Error path: " + run_script_name.slice(0, -last_file.length).replace(/<line>/gi, '\\n'));
                    console.error("${JSParser.fixTextSimpleQuotes(BasicSettings.fullWebSitePath)}" + last_file.trim());
                    console.error("Error message: " + e.message);
                    console.error("Error running this code: \\"" + run_script_code + '"');
                    console.error("Error stack: " + e.stack);
                }`);
        }

        text.AddTextAfterNoTrack(`}});}`);

        return text;
    }

    static async BuildPage(text: StringTracker, sessionInfo: SessionBuild) {
        const builtCode = await PageTemplate.RunAndExport(text, sessionInfo.fullPath, sessionInfo.debug);

        return PageTemplate.AddPageTemplate(builtCode, sessionInfo);
    }

    static AddAfterBuild(text: StringTracker, isDebug: boolean) {
        if (isDebug) {
            text.AddTextBeforeNoTrack("require('source-map-support').install();");
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
