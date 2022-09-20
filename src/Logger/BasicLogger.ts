import { Capitalize } from "../Util/Strings.js"
import emitLog, { LEVELS, LogData } from "./Logger.js"

export abstract class LogPrint<T> implements LogData {
    constructor(protected data: T) {

    }

    abstract toConsole(stackLine: string, loggerName: string, code: string): string;

    toLogMessage(): string {
        return this.data.toString()
    }
}

class SimpleLogPrint extends LogPrint<string> {
    toConsole(stackLine: string, loggerName: string, code: string): string {
        return `[${loggerName}::${Capitalize(code)} -> ${stackLine}]: ${this.toLogMessage()}`
    }
}

export class BasicLogger {
    constructor(private loggerName: string) {
    }

    private convertString(data: LogData | string){
        if(typeof data == 'string'){
            data = new SimpleLogPrint(data)
        }
        return data
    }

    log(event: string, data: LogData | string, stackBack = 0) {
        data = this.convertString(data)
        emitLog(event, this.loggerName, data, 'info', stackBack)
    }

    debug(event: string, data: LogData | string, stackBack = 0) {
        data = this.convertString(data)
        emitLog(event, this.loggerName, data, 'debug', stackBack)
    }

    time(event: string, data: LogData & {measureTime: number}, level: typeof LEVELS[number] = 'info', stackBack = 0) {
        //@ts-ignore
        const startTime = performance.now()

        return () => {
            //@ts-ignore
            const endTime = performance.now()
            data.measureTime = endTime - startTime
            this[level](event, data, stackBack + 1)
        }
    }

    warn(event: string, data: LogData | string, stackBack = 0) {
        data = this.convertString(data)
        emitLog(event, this.loggerName, data, 'warn', stackBack)
    }

    error(event: string, data: LogData | string, stackBack = 0) {
        data = this.convertString(data)
        emitLog(event, this.loggerName, data, 'error', stackBack)
    }

    fatal(event: string, data: LogData | string, stackBack = 0) {
        data = this.convertString(data)
        emitLog(event, this.loggerName, data, 'fatal', stackBack)
    }

}

export const SystemLog = new BasicLogger('System')
export const AppLog = new BasicLogger('App')