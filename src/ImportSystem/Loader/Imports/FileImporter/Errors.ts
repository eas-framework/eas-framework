import { LogData } from "../../../../Logger/Logger"
import { Capitalize } from "../../../../Util/Strings"
import IImporter from "../IImporter"

export class CircleDependenciesError implements LogData {
    constructor(public stack: IImporter[]) {

    }
    toConsole(stackLine: string, loggerName: string, errorCode: string): string {
        return `[${loggerName}::${Capitalize(errorCode)}]: ${this.toLogMessage()}`
    }

    toLogMessage(): string {
        const stackLine = this.stack.map(x => x.importLine).join('\nat')
        return `Circle Dependencies: ${stackLine}`
    }
}

export class ImportNotFound implements LogData {
    constructor(public importer: IImporter) {

    }
    toConsole(stackLine: string, loggerName: string, errorCode: string): string {
        return `[${loggerName}::${Capitalize(errorCode)}]: ${this.toLogMessage()}`
    }

    toLogMessage(): string {
        return `Import not found: ${this.importer.importLine}`
    }
}