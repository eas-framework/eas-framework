import { Options as TransformOptions, transform } from '@swc/core';
import EasySyntax from './EasySyntax';
import {v4 as uuid} from 'uuid';
import { normalizeText } from '../../CompilePage/Templating/utils';
import StringTracker from '../../SourceTracker/StringTracker/StringTracker';
import { SessionBuild } from '../../CompilePage/Session';
import { defaultVariables, GetScriptSettings, TransformJSC } from '../SWC/Settings';
import { getPlugin } from '../../Settings/utils';
import { GlobalSettings } from '../../Settings/GlobalSettings';
import { backToOriginal } from '../../SourceTracker/SourceMap/SourceMapLoad';
import { SWCPrintErrorStringTracker } from '../SWC/Errors';
import { relative } from '../../Settings/ProjectConsts';

function ErrorTemplate(info: string) {
    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${normalizeText(`Syntax Error: ${info}`)}\``;
}

export async function PluginScript(text: StringTracker, sessionInfo: SessionBuild) {
    if(!GlobalSettings.compile.typescript){
        return text;
    }
    
    text = text.trim();

    const Options: TransformOptions = {
        jsc: TransformJSC({
            parser: GetScriptSettings(true)
        }),

        filename: sessionInfo.file.name,
        sourceMaps: true
    };

    let result: StringTracker;
    const CommonJSScript = await EasySyntax.BuildAndExportImports(text.eq)

    try {
        const { code, map } = await transform(CommonJSScript, Options);
        result = map ? await backToOriginal(text, code, map) : new StringTracker(code);
    } catch (err) {
        SWCPrintErrorStringTracker(text, err)
        return new StringTracker(`/*Error -> ${text.topCharStack.toString()}*/`)
    }

    return result;
}

class EnableReturnStatement {
    token = ''
    constructor(public text: string) { 
        while(text.includes(this.token)){
            this.token = 'var__' + uuid().replaceAll('-', '_');
        }
    }

    get variables(){
        return {
            "stop": this.token
        }
    }

    makeReturn(newText: string){
        const replaceRegex = new RegExp(`${this.token}(\\s*\\(\\s*\\))?`, 'g')
        return newText.replace(replaceRegex, 'return ');
    }
}

/**
 * It takes a script and transform to 'Framework' script
 * @param {StringTracker} text - The text to be transformed.
 * @param {boolean} isTypescript - Whether the file is a typescript file or not.
 * @param {SessionBuild} sessionInfo - SessionBuild
 * @returns A function that takes a StringTracker, a boolean, and a SessionBuild and returns a Promise
 * of a StringTracker.
 */
export async function ScriptToEASScriptLastProcesses(text: StringTracker, isTypescript: boolean, sessionInfo: SessionBuild): Promise<StringTracker> {
    text = text.trim();
    const CommonJSScript = await EasySyntax.BuildAndExportImports(text.eq)
    const returnStatement = new EnableReturnStatement(CommonJSScript);

    const Options: TransformOptions = {
        jsc: TransformJSC({
            parser: GetScriptSettings(isTypescript),
        }, {
            ...defaultVariables(),
            ...returnStatement.variables
        }, true),

        minify: !GlobalSettings.development,
        filename: sessionInfo.file.name,
        sourceMaps: true
    };

    let result: StringTracker

    try {
        const { code, map } = await transform(returnStatement.text, Options);
        const withReturn = returnStatement.makeReturn(code);

        result = map ? await backToOriginal(text, withReturn, map) : new StringTracker(withReturn);
    } catch (err) {
        const parse = SWCPrintErrorStringTracker(text, err);

        if (GlobalSettings.development) {
            parse.errorFile = relative(parse.errorFile)
            result = new StringTracker(ErrorTemplate(parse.simpleMessage));
        }
    }

    return result;
}