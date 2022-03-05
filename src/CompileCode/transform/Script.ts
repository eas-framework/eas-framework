import { Options as TransformOptions, transform } from 'sucrase';
import { minify } from "terser";
import StringTracker from '../../EasyDebug/StringTracker';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import EasySyntax from './EasySyntax';

async function ReplaceBefore(code: string, defineData?: { [key: string]: string }) {
    code = await EasySyntax.BuildAndExportImports(code, defineData);
    return code;
}

function ErrorTemplate(info: string){
    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;">Syntax Error: ${info.replaceAll('\n', '<br/>')}</p>'`;
}

function ReplaceAfter(code: string){
    return code.replace('"use strict";', '').replace('Object.defineProperty(exports, "__esModule", {value: true});', '');
}
/**
 * 
 * @param text 
 * @param type 
 * @returns 
 */
export default async function BuildScript(text: StringTracker, isTypescript: boolean, isDebug: boolean, removeToModule: boolean): Promise<string> {
    text = text.trim();

    const Options: TransformOptions = {
        transforms: ['imports'],
    }, define = {
        debug: '' + isDebug
    };
    if (isTypescript) {
        Options.transforms.push('typescript');
    }

    let Result = { code: '' };

    try {
        Result = transform(await ReplaceBefore(text.eq, define), Options);
        Result.code = ReplaceAfter(Result.code);

    } catch (err) {
        const errorMessage = text.debugLine(err);
        PrintIfNew({
            errorName: 'compilation-error',
            text: errorMessage
        });

        if(isDebug)
            Result.code = ErrorTemplate(errorMessage);
    }

    if (!isDebug && !removeToModule) {
        try {
            Result.code = (await minify(Result.code, { module: false })).code;
        } catch (err) {
            PrintIfNew({
                errorName: 'minify',
                text: text.debugLine(err)
            })
        }
    }

    return Result.code;
}