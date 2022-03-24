import { build, Message, transform } from 'esbuild-wasm';
import { RawSourceMap, SourceMapConsumer } from 'source-map';
import StringTracker from '../../EasyDebug/StringTracker';
import { PrintIfNew } from '../../OutputInput/PrintNew';

export function ESBuildPrintError({errors}: {errors:  Message[]}, filePath?: string) {
    for(const err of errors){
        PrintIfNew({
            type: 'error',
            errorName: 'compilation-error',
            text: `${err.text}, on file -> ${filePath ?? err.location.file}:${err?.location?.line ?? 0}:${err?.location?.column ?? 0}`
        });
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
        PrintIfNew({
            type: 'warn',
            errorName: warn.pluginName,
            text: `${warn.text} on file -> ${filePath ?? warn.location.file}:${warn?.location?.line ?? 0}:${warn?.location?.column ?? 0}`
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

