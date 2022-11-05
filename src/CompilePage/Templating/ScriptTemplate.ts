import {simpleTextTemplate} from './utils.js';
import {EXPORT_STRING_EAS_SYNTAX} from '../../ImportSystem/Loader/Imports/FileImporter/NodeImporter.js';
import EJSParser from './EJSParser.js';
import StringTracker from '../../SourceTracker/StringTracker/StringTracker.js';
import {GlobalSettings} from '../../Settings/GlobalSettings.js';

const DEBUG_SCRIPT_TEMPLATE = simpleTextTemplate(new StringTracker(`try {
    <%script%>
} catch(error){
    const errorFile = run_script_name.split(/->/).pop();
    
    error.original = error;
    error.file = errorFile;
    error.code = run_script_code;
    
    throw error;
}`));

const SCRIPT_TEMPLATE = simpleTextTemplate(new StringTracker(`
${EXPORT_STRING_EAS_SYNTAX} async (page, module, Server, bindClientAction) => {
    var { sendFile, writeSafe, write, echo, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, PageVar, GlobalVar} = page;
    var run_script_code = run_script_name;
    var exports = module.exports;

    {
       <%script%>
    }
}`));

export default async function makeCodeAScript(text: StringTracker) {
    return await EJSParser.RunAndExport(text, GlobalSettings.development);
}

export async function addScriptTemplate(text: StringTracker) {
    if (GlobalSettings.development) {
        text = DEBUG_SCRIPT_TEMPLATE({script: text});
    }

    return SCRIPT_TEMPLATE({script: text});
}

