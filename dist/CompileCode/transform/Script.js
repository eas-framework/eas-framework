import { transform } from 'sucrase';
import { minify } from "terser";
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import EasySyntax from './EasySyntax.js';
function ReplaceBefore(code, defineData) {
    code = EasySyntax.BuildAndExportImports(code, defineData);
    return code;
}
function ReplaceAfter(code) {
    return code.replace('"use strict";Object.defineProperty(exports, "__esModule", {value: true});exports. default =', 'export default');
}
/**
 *
 * @param text
 * @param type
 * @returns
 */
export default async function BuildScript(text, pathName, isTypescript, isDebug, removeToMoudule) {
    text = text.trim();
    const Options = {
        transforms: ['imports'],
    }, define = {
        debug: '' + isDebug
    };
    if (isTypescript) {
        Options.transforms.push('typescript');
    }
    let Result = { code: '' };
    try {
        Result = transform(ReplaceBefore(text.eq, define), Options);
        Result.code = ReplaceAfter(Result.code);
    }
    catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: `${err.message}, on file -> ${pathName}:${text.getLine(err?.loc?.line ?? 1).DefaultInfoText.line}:${err?.loc?.column ?? 0}`
        });
    }
    if (!isDebug) {
        Result.code = (await minify(Result.code, { module: false })).code;
    }
    return Result.code;
}
//# sourceMappingURL=Script.js.map