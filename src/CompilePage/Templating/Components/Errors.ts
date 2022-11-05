import {SystemLog} from "../../../Logger/BasicLogger.js";
import StringTracker from "../../../SourceTracker/StringTracker/StringTracker.js";

export function closeTagError(tagName: string, at: StringTracker) {
    SystemLog.warn('close-tag', `Tag "${tagName}" is not closed, used in: ${at.topCharStack.toString()}`);
}