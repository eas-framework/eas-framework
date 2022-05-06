import { Options as TransformOptions, transform } from '@swc/core';
import { backToOriginal } from '../../EasyDebug/SourceMapLoad';
import StringTracker from '../../EasyDebug/StringTracker';
import { ESBuildPrintErrorStringTracker } from '../transpiler/printMessage';
import JSParser from '../JSParser';
import { SessionBuild } from '../Session';
import { GetPlugin } from '../InsertModels';
import {  TransformJSC } from '../transpiler/settings';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasySyntax from './EasySyntax';
import {v4 as uuid} from 'uuid';

function ErrorTemplate(info: string) {

    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${JSParser.printError(`Syntax Error: ${info}`)}\``;
}

export const TransformSettings = {
    globals: {}
}

export async function PluginScript(text: StringTracker, isTypescript: boolean, sessionInfo: SessionBuild) {
    if(!isTypescript){
        return text;
    }
    
    text = text.trim();

    const Options: TransformOptions = {
        jsc: TransformJSC({
            parser: {
                syntax: 'typescript',
                ...GetPlugin((isTypescript ? 'TS' : 'JS') + "Options")
            }
        }),

        filename: sessionInfo.smallPath,
        sourceMaps: true
    };

    let result: StringTracker;
    const CommonJSScript = await EasySyntax.BuildAndExportImports(text.eq)

    try {
        const { code, map } = await transform(CommonJSScript, Options);
        result = map ? await backToOriginal(text, code, map) : new StringTracker(null, code);
    } catch (err) {
        ESBuildPrintErrorStringTracker(text, err, text.extractInfo());

        return new StringTracker(null, `/*Error -> ${text.extractInfo()}*/`)
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
 * It takes a script and transform to EAS-Framework script
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
            parser: {
                syntax: isTypescript ? 'typescript' : 'ecmascript',
                ...GetPlugin((isTypescript ? 'TS' : 'JS') + "Options")
            }
        }, {
            __DEBUG__: '' + sessionInfo.debug,
            ...TransformSettings.globals,
            ...returnStatement.variables
        }, true),

        minify: !sessionInfo.debug,
        filename: sessionInfo.smallPath,
        sourceMaps: true
    };

    let result: StringTracker

    try {
        const { code, map } = await transform(returnStatement.text, Options);
        const withReturn = returnStatement.makeReturn(code);

        result = map ? await backToOriginal(text, withReturn, map) : new StringTracker(null, withReturn);
    } catch (err) {
        const parse = ESBuildPrintErrorStringTracker(text, err, text.extractInfo());

        if (sessionInfo.debug) {
            parse.errorFile = BasicSettings.relative(parse.errorFile)
            result = new StringTracker(null, ErrorTemplate(parse.simpleMessage));
        }
    }

    return result;
}