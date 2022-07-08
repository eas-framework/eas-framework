import EventEmitter from "node:events"
import { writeFile } from "node:fs/promises"
import path from "node:path"
import { GlobalSettings } from "../Settings/GlobalSettings"
import { workingDirectory } from "../Settings/ProjectConsts"
import { getLocationStack } from "../Util/Runtime"
import { Capitalize, splitFirst } from "../Util/Strings"

export const LEVELS = ['info', 'debug', 'warn', 'error', 'fatal']
const STACK_BACK = 3;

/**
 * It takes an event name and a code, and returns a formatted string.
 * @param {string} event - The name of the event.
 * @param code - The code of the event.
 * @returns A function that takes two parameters, event and code, and returns a string.
 */
function formatName(loggerName: string, event: string, code: typeof LEVELS[number]) {
    return `${Capitalize(loggerName)}|${Capitalize(code)}|${event}`
}

/**
 * It takes a string and returns the index of that string in the LEVELS array
 * @param {string} level - The level of the log message.
 * @returns The index of the level in the LEVELS array.
 */
function getLevel(level: string) {
    return LEVELS.indexOf(level)
}

/**
 * It returns the current log level.
 * @returns The current log level
 */
function currentLevel() {
    return getLevel(GlobalSettings.general.logger?.level ?? 'info')
}

/**
 * If the logger.file property exists in the GlobalSettings.general object, return the path to the file
 * @returns The file path to the log file.
 */
function loggerFile() {
    return GlobalSettings.general.logger?.file && path.join(workingDirectory, GlobalSettings.general.logger.file)
}

export interface LogData {
    toLogMessage(): string
    toConsole(stackLine: string, loggerName: string, errorCode: typeof LEVELS[number]): string
}

export const loggerEvent = new EventEmitter()
/**
 * It emits an event, writes to a file if exits on global settings, and writes to the console if the log level is high enough
 * @param {string} event - The name of the event.
 * @param {LogData} data - LogData - the data to log
 * @param [code=info] - The log level, which is one of the following: info, debug, warn, error, fatal
 */
export default function emitLog(event: string, loggerName: string, data: LogData, code: typeof LEVELS[number] = 'info', stackBack = 0) {
    const fullName = formatName(loggerName, event, code)

    loggerEvent.emit(fullName, data); // listen with formatName - name + event + code
    loggerEvent.emit(event, data, code, loggerName); // listen to all event codes

    const stack = getLocationStack(STACK_BACK + stackBack), file = loggerFile()
    file && writeLogToFile(file, loggerName, event, stack, data, code);


    if (getLevel(code) < currentLevel()) {
        writeToConsole(code, data, stack, loggerName)
    }
}

/**
 * If the log level is a valid console method, use it, otherwise use console.error
 * @param code - The level of the log.
 * @param {LogData} data - LogData - The data that was passed to the logger.
 * @param {string} stack - The stack trace of the error.
 */
function writeToConsole(code: typeof LEVELS[number], data: LogData, stack: string, loggerName: string) {
    if (code in console) {
        console[code](data.toConsole(stack, loggerName, code))
    } else {
        console.error(data.toConsole(stack, loggerName, code))
    }
}


/**
 * It takes in an event name, a stack trace, some data, and a code, and returns a formatted string.
 * @param {string} event - The name of the event.
 * @param {string} stack - The stack trace of the error
 * @param {string} data - The data to be logged.
 * @param code - The code of the event.
 * @returns A string with the event, stack, data, and code.
 */
function formatFile(loggerName: string, event: string, stack: string, data: string, code: typeof LEVELS[number]) {
    return `[${formatName(loggerName, event, code)} at ${stack} | ${new Date().toLocaleString()}] ${data}\n`
}

/**
 * It takes a file path, an event, a stack, a data object, and a code, and it writes a formatted string
 * to the file
 * @param {string} filePath - The path to the file you want to write to.
 * @param {string} event - The name of the event that was logged.
 * @param {string} stack - The stack trace of the error.
 * @param {LogData} data - LogData - this is the data that you want to log.
 * @param code - typeof LEVELS[number]
 */
function writeLogToFile(filePath: string, loggerName: string, event: string, stack: string, data: LogData, code: typeof LEVELS[number]) {
    const string = formatFile(loggerName, event, stack, data.toLogMessage(), code)
    writeFile(filePath, string, { flag: 'a' })
}