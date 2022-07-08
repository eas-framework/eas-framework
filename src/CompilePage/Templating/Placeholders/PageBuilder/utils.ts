import { SystemLog } from "../../../../Logger/BasicLogger";
import { SystemError } from "../../../../Logger/ErrorLogger";
import { GlobalSettings } from "../../../../Settings/GlobalSettings";
import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker";
import EasyFS from "../../../../Util/EasyFS";
import { SessionBuild } from "../../../Session";
import ArrayGetter from "./ArrayGetter";
import BaseParser, { BaseParserBlock } from "./BaseParser";

export const DYNAMIC = 'dynamic'
export const INHERIT = 'inherit'

/**
 * It checks if the component has the dynamic SSR attribute, if it doesn't and development mode is on, adds it
 * @param {BaseParser} parser - The parser that is being used to parse the file.
 * @param {SessionBuild} session - The session object that contains the file and other information.
 * @effect {BaseParser} - remove the dynamic attribute from the component.
 * @returns {boolean} - If the component has the dynamic attribute
 */
export async function checkDynamicSSR(parser: BaseParser, session: SessionBuild){
    const getter = new ArrayGetter(parser.values)
    const haveDynamic = getter.popAny(DYNAMIC)

    if(haveDynamic){
        return true
    } else if(!GlobalSettings.development){
        return false
    }

    parser = parser.clone()
    parser.values.push({key: DYNAMIC, value: true})

    const newCode = parser.rebuild()
    SystemLog.warn('dynamic-ssr', `Dynamic SSR attribute added to: ${newCode.topCharStack.toString()}`)

    await EasyFS.writeFileAndPath(session.file.full, newCode.eq)

    return true
}



/**
 * It takes a parser and an array of values, and returns an array of values
 * @param {BaseParser} parser - The parser object
 * @param values - The array of values that are being filtered.
 * @effect {BaseParser} - remove objects from array that the value is 'inherit'
 * @returns An array of BaseParserBlock
 */
export function filterInherit(parser: BaseParser, values = []): BaseParserBlock[]{
    const index = parser.values.findIndex(x => x.value instanceof StringTracker && x.value.eq.toLowerCase() === INHERIT)

    if(index === -1){
        return values
    }

    values.push(parser.values.splice(index, 1))
    filterInherit(parser, values)

    return values
}