import {TransformOptions, transform } from 'esbuild-wasm';
import { backToOriginal } from '../../EasyDebug/SourceMapLoad';
import StringTracker from '../../EasyDebug/StringTracker';
import { ESBuildPrintErrorStringTracker, ESBuildPrintWarningsStringTracker } from '../esbuild/printMessage';
import JSParser from '../JSParser';
import { SessionBuild } from '../Session';
import EasySyntax from './EasySyntax';

function ErrorTemplate(info: string){
    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += "<p style=\\"color:red;text-align:left;font-size:16px;\\">Syntax Error: ${JSParser.fixTextSimpleQuotes(info.replaceAll('\n', '<br/>'))}</p>"`;
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
        const errorMessage = text.debugLine(err);

        if(sessionInfo.debug)
            result = new StringTracker(null, ErrorTemplate(errorMessage));
    }

    return result;
}