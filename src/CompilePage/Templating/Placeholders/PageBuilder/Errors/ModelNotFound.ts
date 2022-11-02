import {LogData} from '../../../../../Logger/Logger.js';
import StringTrackerStack from '../../../../../SourceTracker/StringTracker/StringTrackerStack.js';
import STSInfo from '../../../../../SourceTracker/StringTracker/STSInfo.js';
import PPath from '../../../../../Settings/PPath.js';

export default class ModelNotFoundError implements LogData {
    /**
     * An error that occurs when the framework can't read the model file
     * @note Throw an error when it's time to print to the console
     * @param importStack
     */
    private importStack: StringTrackerStack
    constructor(importStack: StringTrackerStack, modelPath: PPath) {
        this.importStack =  importStack.clone();
        this.importStack.push(new STSInfo(modelPath, 0, 0));
    }

    toConsole(): string {
        throw this.toLogMessage();
    }

    toLogMessage(): string {
        return `Model not found when building the page - ${this.importStack.toString()}`
    }
}