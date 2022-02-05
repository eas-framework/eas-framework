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
    return `module.exports = () => (DataObject) => DataObject.out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;">Syntax Error: ${info}</p>'`;
}

function ReplaceAfter(code: string){
    return code.replace('"use strict";Object.defineProperty(exports, "__esModule", {value: true});', '');
}
/**
 * 
 * @param text 
 * @param type 
 * @returns 
 */
export default async function BuildScript(text: StringTracker, pathName: string, isTypescript: boolean, isDebug: boolean, removeToMoudule: boolean): Promise<string> {
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
        const errorMessage = `${err.message}, on file -> ${pathName}:${text.getLine(err?.loc?.line??1).DefaultInfoText.line}:${err?.loc?.column??0}`;
        PrintIfNew({
            errorName: 'compilation-error',
            text: errorMessage
        });

        if(isDebug)
            Result.code = ErrorTemplate(errorMessage);
    }

    if (!isDebug && !removeToMoudule) {
        Result.code = (await minify(Result.code, { module: false })).code;
    }

    return Result.code;
}