import StringTracker from '../../EasyDebug/StringTracker';
import { BuildInComponent, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import JSParser from '../../CompileCode/JSParser'
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import { minifyJS } from '../../CompileCode/esbuild/minify';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

const serveScript = '/serv/temp.js';

async function template(BuildScriptWithoutModule: BuildScriptWithoutModule, name: StringTracker | string, params: StringTracker | string, selector: string, mainCode: StringTracker, path: string, isDebug: boolean) {
    const parse = await JSParser.RunAndExport(mainCode, path, isDebug);
    return new StringTracker().Plus$ `function ${name}({${params}}, selector${selector ? ` = "${selector}"`: ''}, out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${await BuildScriptWithoutModule(parse)}
        var exports = ${name}.exports;
        return sendToSelector(selector, out_run_script.text);
    }\n${name}.exports = {};`
}

export default async function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo);

    sessionInfo.script(serveScript, {async: null});

    let scriptInfo = await template(
        sessionInfo.BuildScriptWithPrams,
        dataTag.popAnyTracker('name', 'connect'),
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