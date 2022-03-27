import {TransformOptions, transform } from 'esbuild-wasm';
import { backToOriginal } from '../../EasyDebug/SourceMapLoad';
import StringTracker from '../../EasyDebug/StringTracker';
import { ESBuildPrintErrorStringTracker, ESBuildPrintWarningsStringTracker } from '../esbuild/printMessage';
import JSParser from '../JSParser';
import { SessionBuild } from '../Session';
import EasySyntax from './EasySyntax';

function ErrorTemplate(info: string){
    
    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += \`${JSParser.printError(`Syntax Error: ${JSParser.fixTextSimpleQuotes(info.replaceAll('\n', '<br/>'))}`)}\``;
}

/**
 * 
 * @param text 
 * @param type 
 * @returns 
 */
export default async function BuildScript(text: StringTracker, isTypescript: boolean, sessionInfo: SessionBuild): Promise<StringTracker> {
    text = text.trim();

    const Options: TransformOptions = {
        format: 'cjs',
        loader: isTypescript ? 'ts': 'js',
        sourcemap: sessionInfo.debug,
        sourcefile: sessionInfo.smallPath,
        define: {
            debug: '' + sessionInfo.debug
        }
    };

    let result: StringTracker

    try {
        const {code, map, warnings} = await transform(await EasySyntax.BuildAndExportImports(text.eq), Options);
        ESBuildPrintWarningsStringTracker(text, warnings);
        result = map ? await backToOriginal(text, code, map): new StringTracker(null, code);
    } catch (err) {
        ESBuildPrintErrorStringTracker(text, err);

        if(sessionInfo.debug){
            const first = err.errors[0];
            first.location && (first.location.lineText = null)
            result = new StringTracker(null, ErrorTemplate(text.debugLine(first)));
        }
    }

    return result;
}