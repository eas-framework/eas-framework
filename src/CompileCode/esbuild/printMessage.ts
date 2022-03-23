import { build, Message, transform } from 'esbuild-wasm';
import StringTracker from '../../EasyDebug/StringTracker';
import { PrintIfNew } from '../../OutputInput/PrintNew';

export function ESBuildPrintError(filePath: string, {errors}: {errors:  Message[]}) {
    for(const err of errors){
        PrintIfNew({
            type: 'error',
            errorName: 'compilation-error',
            text: `${err.text}, on file -> ${filePath}:${err?.location?.line ?? 0}:${err?.location?.column ?? 0}`
        });
    }
}


export function ESBuildPrintWarnings(filePath: string, warnings: Message[]) {
    for (const warn of warnings) {
        PrintIfNew({
            type: 'warn',
            errorName: warn.pluginName,
            text: `${warn.text} on file -> ${filePath}:${warn?.location?.line ?? 0}:${warn?.location?.column ?? 0}`
        });
    }
}

export function ESBuildPrintWarningsStringTracker(base: StringTracker, warnings: Message[]) {
    for (const warn of warnings) {
        PrintIfNew({
            type: 'warn',
            errorName: warn.pluginName,
            text: base.debugLine(warn)
        });
    }
}


export function ESBuildPrintErrorStringTracker(base: StringTracker, err: Message) {
    PrintIfNew({
        errorName: 'compilation-error',
        text: base.debugLine(err)
    });
}

