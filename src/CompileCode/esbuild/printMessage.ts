import { build, Message, transform } from 'esbuild-wasm';
import { RawSourceMap, SourceMapConsumer } from 'source-map';
import StringTracker from '../../EasyDebug/StringTracker';
import { print } from '../../OutputInput/Console';
import { createNewPrint } from '../../OutputInput/PrintNew';

export function ESBuildPrintError({errors}: {errors:  Message[]}, filePath?: string) {
    for(const err of errors){
        const [funcName, printText] = createNewPrint({
            type: 'error',
            errorName: 'compilation-error',
            text: `${err.text}, on file -> ${filePath ?? err.location.file}:${err?.location?.line ?? 0}:${err?.location?.column ?? 0}`
        });
        print[funcName](printText);
    }
}

export async function ESBuildPrintErrorSourceMap({errors}: {errors:  Message[]}, sourceMap: RawSourceMap, filePath?: string) {
    const original = await new SourceMapConsumer(sourceMap);
    for(const err of errors){
        const source = original.originalPositionFor(err.location);
        if(source.source)
            err.location = <any>source;
    }
    ESBuildPrintError({errors}, filePath);
}


export function ESBuildPrintWarnings(warnings: Message[], filePath?: string) {
    for (const warn of warnings) {
        const [funcName, printText] = createNewPrint({
            type: 'warn',
            errorName: warn.pluginName,
            text: `${warn.text} on file -> ${filePath ?? warn.location.file}:${warn?.location?.line ?? 0}:${warn?.location?.column ?? 0}`
        });
        print[funcName](printText);
    }
}

export function ESBuildPrintWarningsStringTracker(base: StringTracker, warnings: Message[]) {
    for (const warn of warnings) {
        const [funcName, printText] = createNewPrint({
            type: 'warn',
            errorName: warn.pluginName,
            text: base.debugLine(warn)
        });
        print[funcName](printText);
    }
}


export function ESBuildPrintErrorStringTracker(base: StringTracker, {errors}:{errors: Message[]}) {
    for(const err of errors){
        const [funcName, printText] = createNewPrint({
            errorName: 'compilation-error',
            text: base.debugLine(err)
        });
        print[funcName](printText);
    }
}

