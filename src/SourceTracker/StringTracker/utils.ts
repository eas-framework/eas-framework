import path from "path";
import StringTracker from "./StringTracker.js";

export function getLocationSourcePath(source: StringTracker, fullLastPath = false){
    const stack = source.topCharStack.hiddenStack
    let buildText = ''

    if(!stack.length){
        return buildText
    }

    for (let i = 0; i < stack.length - 1; i++) {
        const fileSource = stack[i].toString()
        buildText += fileSource + '->'
    }

    const last = stack.at(-1)
    buildText += fullLastPath ? path.join(last.source.locate.source, last.toString()): last.toString()
    return buildText
}