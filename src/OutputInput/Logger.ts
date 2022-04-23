import chalk from 'chalk';

export interface PreventLog {
    id?: string,
    text: string,
    errorName: string,
    type?: "warn" | "error"
}

export const Settings: { PreventErrors: string[] } = {
    PreventErrors: []
}

const PreventDoubleLog: string[] = [];

export const ClearWarning = () => PreventDoubleLog.length = 0;

/**
 * If the error is not in the PreventErrors array, print the error
 * @param {PreventLog}  - `id` - The id of the error.
 */
export function createNewPrint({ id, text, type = "warn", errorName }: PreventLog) {
    if (!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)) {
        PreventDoubleLog.push(id ?? text);
        const logType = type == 'error' ? 'important' : type;

        const splitColor = text.split('<color>');

        const mainMessage = chalk.magenta(splitColor.pop().replace(/<line>/gi, ' -> '))

        let about = '-'.repeat(10) + (type == 'error' ? chalk.bold(type) : type) + '-'.repeat(10)
        return [logType,
            about + '\n' +
            chalk.blue(splitColor.shift() || '') + '\n' +
            mainMessage + '\n' +
            chalk.red(`Error-Code: ${errorName}`) + '\n' +
            '-'.repeat(type.length + 20) + '\n']
    }
    return ["do-nothing"]
}

export function LogToHTML(log: string) {
    return log.replace(/\n|<line>|<color>/, '<br/>')
}

type baseEventData = {date?: Date}
export class TimeLogger<T, D extends baseEventData> {
    private events: { name: T, func: (data: D) => void }[] = [];

    eventLog: D[] = []
    logAll = false

    event(name: T, func: (data: D) => void) {
        this.events.push({ name, func })
    }

    dispatch(name: T, data: D = <any>{}) {
        data.date = new Date();
        this.eventLog.push(data)
        this.events.forEach(x => x.name == name && x.func(data))
        this.simpleLog(name, data)
    }

    private simpleLog(name: T, data: D) {
        if (this.logAll)
            console.log(name, data)
    }
}

type eventNames = 'compile-time' | 'start-compile' | 'end-compile' | 'create-sitemap' | 'end-create-sitemap'
type eventArguments = { time?: number, file?: string, debug?: boolean} & baseEventData

export const PageTimeLogger = new TimeLogger<eventNames, eventArguments>()