import { RawSourceMap, SourceMapConsumer } from 'source-map';
import { SystemLog } from '../../Logger/BasicLogger';
import { LogData } from '../../Logger/Logger';
import StringTracker from '../../SourceTracker/StringTracker/StringTracker';


export function parseSWCError(err: { message: string, stack: string, code: string }, changeLocations = (line: number, column: number, source: string) => { return { line, column, source } }) {
    const splitData: string[] = err.stack.trim().split('\n');
    const errorFileAsIndex = splitData.reverse().findIndex((x: string) => x.includes('//!'))

    if (errorFileAsIndex == -1) {
        let errorFile: string
        const message = err.message.replace(/(;[0-9]m)(.*?\.\w+)(\W\[0m:)([0-9]+):([0-9]+)\]/, (_, start, file, locationStart, g1, g2) => {
            const { line, column, source } = changeLocations(Number(g1), Number(g2), file)
            errorFile = source
            return `${start}${source + locationStart + line}:${column}]`
        })

        return {
            errorCode: err.code,
            errorLines: splitData[0],
            errorFile,
            simpleMessage: message,
        }
    }

    const errorFile = splitData[errorFileAsIndex].split('//!').pop()
    const errorLines = splitData.slice(splitData.length - errorFileAsIndex, - 3).map(x => x.substring(x.indexOf('│') + 1)).join('\n');

    let errorCode: string = splitData.at(-2);
    errorCode = errorCode.substring(errorCode.indexOf('`')).split('[0m').shift().trim();

    return {
        errorFile,
        errorLines,
        errorCode
    }
}

class SWCStackError implements LogData {

    constructor(public err: { errorCode: string; errorLines: string; errorFile: string; simpleMessage?: string; }){

    }

    toLogMessage(): string {
        return this.err.simpleMessage ?? `${this.err.errorCode} on file ${this.err.errorFile}`

    }

    toConsole(stackLine: string, loggerName: string, errorCode: string): string {
        return `[${loggerName}::${errorCode} -> ${stackLine}]: ${this.toLogMessage()}\n${this.err.errorLines}`
    }
}


export function SWCPrintError(err: any) {
    const parseError = parseSWCError(err);
    SystemLog.error('swc-error', new SWCStackError(parseError), 1);
}

export async function SWCPrintErrorSourceMap(err: any, sourceMap: RawSourceMap) {
    const original = await new SourceMapConsumer(sourceMap);
    const parseError = parseSWCError(err, (line, column) => original.originalPositionFor({ line, column }));

    SystemLog.error('swc-error', new SWCStackError(parseError), 1);
}


export function SWCPrintErrorStringTracker(tracker: StringTracker, err: any) {

    const parseError = parseSWCError(err, (searchLine, searchColumn) => {
        const { column, line, source } = tracker.originalPositionFor(searchLine, searchColumn)
        return {
            column,
            line,
            source: source.small
        }
    });

    SystemLog.error('swc-error', new SWCStackError(parseError), 1);

    return parseError
}

