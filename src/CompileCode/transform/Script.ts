import { Options as TransformOptions, transform } from '@swc/core';
import { backToOriginal } from '../../EasyDebug/SourceMapLoad';
import StringTracker from '../../EasyDebug/StringTracker';
import { ESBuildPrintErrorStringTracker } from '../transpiler/printMessage';
import JSParser from '../JSParser';
import { SessionBuild } from '../Session';
import EasySyntax from './EasySyntax';
import { GetPlugin } from '../InsertModels';
import { Commonjs, esTarget, TransformJSC } from '../transpiler/settings';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import path from 'path/win32';

function ErrorTemplate(info: string) {

    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${JSParser.printError(`Syntax Error: ${info.replaceAll('\n', '<br/>')}`)}\``;
}

/**
 * 
 * @param text 
 * @param type 
 * @returns 
 */
export default async function BuildScript(text: StringTracker, isTypescript: boolean, sessionInfo: SessionBuild): Promise<StringTracker> {
    text = text.trim();

    const Options: TransformOptions = Commonjs({
        jsc: TransformJSC({
            parser: {
                syntax: isTypescript ? 'typescript' : 'ecmascript',
                ...GetPlugin((isTypescript ? 'TS' : 'JS') + "Options")
            }
        }),
        filename: sessionInfo.smallPath,
        sourceMaps: true
    });

    let result: StringTracker

    const scriptDefine = await EasySyntax.BuildAndExportImports(text.eq, { debug: '' + sessionInfo.debug });
    
    try {
        const { code, map } = await transform(scriptDefine, Options);
        result = map ? await backToOriginal(text, code, map) : new StringTracker(null, code);
    } catch (err) {
        const parse = ESBuildPrintErrorStringTracker(text, err);

        if (sessionInfo.debug) {
            parse.errorFile =  BasicSettings.relative(parse.errorFile)
            result = new StringTracker(null, ErrorTemplate(parse.simpleMessage));
        }
    }

    return result;
}