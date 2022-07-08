import { SystemLog } from "../../../Logger/BasicLogger";
import StringTracker from "../../../SourceTracker/StringTracker/StringTracker";

export function closeTagError(tagName: string, at: StringTracker){
    SystemLog.warn('close-tag', `Tag "${tagName}" is not closed, used in: ${at.topCharStack.toString()}`)
}