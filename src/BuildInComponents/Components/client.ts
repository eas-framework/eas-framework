import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule, SessionInfo } from '../../CompileCode/XMLHelpers/CompileTypes';
import JSParser from '../../CompileCode/JSParser'
import { minify } from "terser";

function replaceForClient(BetweenTagData: string, exportInfo: string){
    BetweenTagData = BetweenTagData.replace(`"use strict";Object.defineProperty(exports, "__esModule", {value: true});`, exportInfo);
    return BetweenTagData;
}

const serveScript = '/serv/temp.js';

async function template(BuildScriptWithoutModule: BuildScriptWithoutModule, name: string, params: string, selector: string, mainCode: StringTracker, path: string, isDebug: boolean){
    const parse = JSParser.RunAndExport(mainCode, path, isDebug);
    return `function ${name}({${params}}, selector = "${selector}", out_run_script = {text: ''}){
        const {write, writeSafe, setResponse, sendToSelector} = new buildTemplate(out_run_script);
        ${
            replaceForClient(
                    await BuildScriptWithoutModule(parse),
                    `var exports = ${name}.exports;`
                )
        }
        return sendToSelector(selector, out_run_script.text);
    }\n${name}.exports = {};`
}

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, BuildScriptWithoutModule: BuildScriptWithoutModule, sessionInfo: SessionInfo): Promise<BuildInComponent>{

    BetweenTagData = await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, (x: StringTracker) => x.eq, sessionInfo);

    sessionInfo.scriptURLSet.push({
        url: serveScript,
        attributes: {async: null}
    });

    let scriptInfo = await template(
        BuildScriptWithoutModule,
        dataTag.getValue('name'),
        dataTag.getValue('params'),
        dataTag.getValue('selector'),
        BetweenTagData,
        pathName,
        isDebug && !InsertComponent.SomePlugins("SafeDebug")
    );

    const minScript = InsertComponent.SomePlugins("MinJS") || InsertComponent.SomePlugins("MinAll");

    if (minScript) {
        scriptInfo = (await minify(scriptInfo, { module: false, format: { comments: 'all' } })).code;
    }

    sessionInfo.script.addText(scriptInfo);

    return {
        compiledString: new StringTracker()
    }
}