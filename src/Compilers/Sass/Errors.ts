import { fileURLToPath } from "node:url";
import { LogPrint, SystemLog } from "../../Logger/BasicLogger";
import { LogData } from "../../Logger/Logger";
import StringTracker from "../../SourceTracker/StringTracker/StringTracker";
import { Capitalize } from "../../Util/Strings";

export function getSassErrorLine({ sassStack }) {
    const loc = sassStack.match(/[0-9]+:[0-9]+/)[0].split(':').map(x => Number(x));
    return { line: loc[0], column: loc[1] }
}

class SassStackError implements LogData {
    constructor(public err: any, public errorLine: (err: any) => { line: number, column: number }) {
    }

    toConsole(stackLine: string, loggerName: string, errorCode: string): string {
        return `[${loggerName}::${Capitalize(errorCode)} -> ${stackLine}]: ${this.toLogMessage()}`
    }

    private get line() {
        const { line, column } = this.errorLine(this.err)
        return `${fileURLToPath(this.err.span.url)}:${line ?? 0}:${column ?? 0}`
    }

    toLogMessage(): string {
        return `${this.err.message} at ${this.line}`
    }
}

function sassErrorStatus(err: any, log: SassStackError, backTrack: number){
    SystemLog[err?.status == 5 ? 'warn': 'error'](
        err?.status == 5 ? 'sass-warning' : 'sass-error',
        log,
        backTrack + 1,
    )
}

export function logSassError(err: any) {
    sassErrorStatus(err, new SassStackError(err, getSassErrorLine), 1)
}

export function logSassErrorTracker(err: any, track: StringTracker) {
    if (err.span.url) return logSassError(err);

    function original(err: any){
        const {line, column} = getSassErrorLine(err);
        return track.originalPositionFor(line, column)
    }

    sassErrorStatus(err, new SassStackError(err, original), 1)
}