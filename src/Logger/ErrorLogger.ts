import {SystemLog} from "./BasicLogger.js";
import {LogData} from "./Logger.js";
import chalk from 'chalk';


export class ErrorPrint implements LogData {
    constructor(private event: string, private error: Error, private fatal?: boolean) {

    }

    toConsole(stackLine: string, loggerName: string): string {
        if (this.fatal) {
            throw this.error;
        }

        return chalk.blackBright(`${loggerName} -> `) +
            chalk.red(`[ERROR::${this.event}]`) + '\n' +
            this.toLogMessage() + '\nEmit at ' + stackLine;
    }

    toLogMessage(): string {
        return this.error.message;
    }
}

export function SystemError(event: string, error: Error, fatal?: boolean, backTrace = 0) {
    const dataWriter = new ErrorPrint(event, error, fatal);
    SystemLog[fatal ? 'fatal' : 'error'](event, dataWriter, 1 + backTrace);
}

export function SystemAutoError(error: Error, fatal?: boolean, backTrace = 0) {
    SystemError(error.name, error, fatal, backTrace + 1);
}