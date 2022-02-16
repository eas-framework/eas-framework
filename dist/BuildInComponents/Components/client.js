import StringTracker from '../../EasyDebug/StringTracker.js';
import JSParser from '../../CompileCode/JSParser.js';
import { minify } from "terser";
function replaceForClient(BetweenTagData, exportInfo) {
    BetweenTagData = BetweenTagData.replace(`"use strict";Object.defineProperty(exports, "__esModule", {value: true});`, exportInfo);
    return BetweenTagData;
}
const serveScript = '/serv/temp.js';
async function template(BuildScriptWithoutModule, name, params, selector, mainCode, path, isDebug) {
    const parse = JSParser.RunAndExport(mainCode, path, isDebug);
    return `function ${name}({${params}}, selector = "${selector}", out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${replaceForClient(await BuildScriptWithoutModule(parse), `var exports = ${name}.exports;`)}
        return sendToSelector(selector, out_run_script.text);
    }\n${name}.exports = {};`;
}
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, BuildScriptWithoutModule, sessionInfo) {
    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, (x) => x.eq, sessionInfo);
    sessionInfo.scriptURLSet.push({
        url: serveScript,
        attributes: { async: null }
    });
    let scriptInfo = await template(BuildScriptWithoutModule, dataTag.getValue('name'), dataTag.getValue('params'), dataTag.getValue('selector'), BetweenTagData, pathName, isDebug && !InsertComponent.SomePlugins("SafeDebug"));
    const minScript = InsertComponent.SomePlugins("MinJS") || InsertComponent.SomePlugins("MinAll");
    if (minScript) {
        scriptInfo = (await minify(scriptInfo, { module: false, format: { comments: 'all' } })).code;
    }
    sessionInfo.script.addText(scriptInfo);
    return {
        compiledString: new StringTracker()
    };
}
//# sourceMappingURL=client.js.map