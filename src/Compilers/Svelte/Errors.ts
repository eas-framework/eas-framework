import { Warning } from "svelte/types/compiler/interfaces";
import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from "source-map";
import { LogData } from "../../Logger/Logger.js";
import { SystemLog } from "../../Logger/BasicLogger.js";
import PPath from "../../Settings/PPath.js";
import { Capitalize } from "../../Util/Strings.js";

async function getOriginalLocation(sourceMap: RawSourceMap, ...locations: {line: number, column: number}[]){
    const map = await new SourceMapConsumer(sourceMap)

    return locations.map(x => map.originalPositionFor(x))
}

class SvelteStackError implements LogData {
    constructor(public err: Warning, public original: {line: number, column: number}, public file: PPath) {
    }

    toConsole(stackLine: string, loggerName: string, errorCode: string): string {
        return `[${loggerName}::${Capitalize(errorCode)} -> ${stackLine}]: ${this.toLogMessage()}\n${this.err.frame}`
    }

    private get lineLocation(){
        return `:${this.original.line}:${this.original.column}`
    }

    toLogMessage(): string {
        return `${this.err.message} at ${this.file.small + this.lineLocation}`
    }
}

export async function logSvelteError(err: Warning, file: PPath, sourceMap: RawSourceMap) {
    const [startOriginal] = await getOriginalLocation(sourceMap, err.start)
    SystemLog.error('svelte-' + err.code, new SvelteStackError(err, startOriginal, file), 1)
}

export async function logSvelteWarn(warnings: Warning[], file: PPath, sourceMap: RawSourceMap) {
    const locationOriginal = await getOriginalLocation(sourceMap, ...warnings.map(x => x.start))

    for(const warn in warnings){
        const warnOBJ = warnings[warn]
        SystemLog.warn('svelte-' + warnOBJ.code, new SvelteStackError(warnOBJ, locationOriginal[warn], file), 1)
    }
}