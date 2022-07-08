import StringTracker from "../../../../../SourceTracker/StringTracker/StringTracker";
import EJSParser from "../../../EJSParser";
import { COMPILE_PARAMS } from "./ExportContext";

export function templateScript(scripts: StringTracker[]) {
    const build = new StringTracker();
    build.addTextAfter(`return async (${COMPILE_PARAMS.join(',')}) => {var __write;`)

    for (const i of scripts) {
        build.addTextAfter(`\n__write = {text: ''};var {write, writeSafe, echo} = createDateWriter(__write);`)
        build.plus(i)
    }

    build.addTextAfter(`}`)
    return build;
}

export function rebuildCode(parser: EJSParser, writerArray: { text: string }[]) {
    const build = new StringTracker();

    for (const i of parser.values) {
        if (i.type == 'text') {
            build.plus(i.text)
            continue
        }

        build.addTextAfter(writerArray.pop().text);
    }

    return build;
}