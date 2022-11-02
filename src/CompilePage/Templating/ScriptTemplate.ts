import {simpleTextTemplate} from './utils.js';
import {DEFAULT_EXPORT_STRING} from '../../ImportSystem/Loader/Imports/FileImporter/NodeImporter.js';
import EJSParser from './EJSParser.js';
import StringTracker from '../../SourceTracker/StringTracker/StringTracker.js';
import {GlobalSettings} from '../../Settings/GlobalSettings.js';

const DEBUG_SCRIPT_TEMPLATE = simpleTextTemplate(new StringTracker(`try {
    <%script%>
} catch(error){
    const errorFile = run_script_name.split(/->/).pop();

    const pageError = new Error("page-error");
    
    pageError.original = error;
    pageError.errorFile = errorFile;
    pageError.codeError = run_script_code;
    
    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;">Error message: '+error.message+'<br/> on file: '+ errorFile +'</p>';
    
    throw pageError;
}`));

const SCRIPT_TEMPLATE = simpleTextTemplate(new StringTracker(`
${DEFAULT_EXPORT_STRING} (page, module, Server, bindClientAction) => {
    var { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page;
    var run_script_code = run_script_name;
    var exports = module.exports;

    {
       <%script%>
    }
}`));

export default async function addScriptTemplate(text: StringTracker) {
    text = await EJSParser.RunAndExport(text, GlobalSettings.development);


    if (GlobalSettings.development) {
        text = DEBUG_SCRIPT_TEMPLATE({script: text});
    }

    return SCRIPT_TEMPLATE({script: text});
}