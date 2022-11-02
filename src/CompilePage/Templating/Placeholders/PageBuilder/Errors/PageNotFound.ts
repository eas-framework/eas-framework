import {LogData} from '../../../../../Logger/Logger.js';
import PPath from '../../../../../Settings/PPath.js';

export default class PageNotFoundError implements LogData {
    /**
     * An error that occurs when the framework can't read the model file
     * @note Throw an error when it's time to print to the console
     * @param page
     */
    constructor(public page: PPath) {
    }

    toConsole(): string {
        throw this.toLogMessage();
    }

    toLogMessage(): string {
        return `Page not found - ${this.page.full}`
    }
}