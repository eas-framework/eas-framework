import StringTracker from '../../EasyDebug/StringTracker';
import { BuildInComponent, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import JSParser from '../../CompileCode/JSParser'
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import { minifyJS } from '../../CompileCode/transpiler/minify';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

const serveScript = '/serv/temp.js';

async function template(BuildScriptWithoutModule: BuildScriptWithoutModule, name: StringTracker | string, params: StringTracker | string, selector: string, mainCode: StringTracker, path: string, isDebug: boolean) {
    const parse = await JSParser.RunAndExport(mainCode, path, isDebug, true);
    return new StringTracker().Plus$ `function ${name}({${params}}, selector${selector ? ` = "${selector}"`: ''}, out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        var exports = ${name}.exports;
        ${await BuildScriptWithoutModule(parse)}
        ${name}.exports = exports;
        return sendToSelector(selector, out_run_script.text);
    }\n${name}.exports = {};`
}

export default async function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo);

    sessionInfo.script(serveScript, {defer: null});

    let scriptInfo = await template(
        sessionInfo.BuildScriptWithPrams,
        dataTag.popAnyTracker('fn-name', 'connect'),
        dataTag.popAnyTracker('params', ''),
        dataTag.popAnyDefault('selector', ''),
        BetweenTagData,
        pathName,
        sessionInfo.debug && !InsertComponent.SomePlugins("SafeDebug")
    );

    const addScript = sessionInfo.addScriptStylePage('script', dataTag, type);
    if (InsertComponent.SomePlugins("MinJS") || InsertComponent.SomePlugins("MinAll")) {
        addScript.addText(await minifyJS(scriptInfo.eq, BetweenTagData));
    } else {
        addScript.addStringTracker(scriptInfo);
    }

    return {
        compiledString: new StringTracker()
    }
}