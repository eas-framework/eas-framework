import path from "path";
import { locationConnectorPPath } from "../../../../../../ImportSystem/unit";
import createDateWriter from "../../../../../../RuntimeUtils/DataWriter";
import PPath from "../../../../../../Settings/PPath";
import { StringAnyMap } from "../../../../../../Settings/types";
import StringTracker from "../../../../../../SourceTracker/StringTracker/StringTracker";
import { SessionBuild } from "../../../../../Session";
import EJSParser from "../../../../EJSPArser";
import renderAttrs, { addImportSource } from "./renderAttrs";
import STWriter from "./STWriter";

const SCRIPT = 'script',
    STYLE = 'style',
    DEFINE = 'define',
    STORE = 'store',
    PAGE_FILENAME = 'page__filename',
    PAGE_DIRNAME = 'page__dirname',
    LOCALPATH = '__localpath',
    ATTRIBUTES = 'attrs',
    DEPENDENCE = 'dependence',
    ATTRS_HTML = 'attrsHTML',
    ATTRS_OBJECT_HTML = 'attrsObjectHTML',
    SPACE_ONE = 'spaceOne',
    CREATE_DATE_WRITER = 'createDateWriter',
    ATTRDEFAULT = 'attrdefault'

export const COMPILE_PARAMS = [SCRIPT, STYLE, DEFINE, STORE, PAGE_FILENAME, PAGE_DIRNAME, LOCALPATH, ATTRIBUTES, DEPENDENCE, ATTRS_HTML, ATTRS_OBJECT_HTML, CREATE_DATE_WRITER, ATTRDEFAULT]

type Writer = { text: string }
function createContext(session: SessionBuild, parser: EJSParser, attributes: StringAnyMap = {}, importSource?: PPath) {
    if (importSource) {
        addImportSource(attributes, importSource)
    }

    const define = {}
    const contextWriter = new STWriter(parser)

    const exportObject = {
        [SCRIPT]: session.script.bind(session),
        [STYLE]: session.style.bind(session),
        [DEFINE](key: any, value: any) {
            define[String(key)] = value
        },
        [STORE]: session.compileRunTimeStore,
        [PAGE_FILENAME]: session.file.full,
        [PAGE_DIRNAME]: session.file.dirname.full,
        [LOCALPATH]: path.join(path.sep, session.file.nested),
        [ATTRIBUTES]: attributes,
        [DEPENDENCE](file: string) {
            session.dependencies.updateDep(
                locationConnectorPPath(file, session.file),
                true
            )
        },
        [ATTRS_HTML](attrs: StringAnyMap = attributes, ...onlySome: string[]) {
            if (typeof attrs == 'string') {
                onlySome.unshift(attrs);
                attrs = attributes;
            }
            return renderAttrs(attrs, onlySome);
        },
        [ATTRS_OBJECT_HTML](attrs: StringAnyMap = attributes, ...onlySome: string[]) {
            if (typeof attrs == 'string') {
                onlySome.unshift(attrs);
                attrs = attributes;
            }
            return renderAttrs(attrs, onlySome, true);
        },
        [SPACE_ONE](text: string | boolean, value = text){
            if(text) {
                return ' ' + String(value).trim()
            }
            return ''
        },
        [CREATE_DATE_WRITER](data: Writer) {
            return contextWriter.writer()
        },
        [ATTRDEFAULT](keys: string | string[], value: any) {
            if (!Array.isArray(keys)) {
                keys = [keys];
            }

            for (const key of keys) {
                attributes[key] ??= value;
            }
        }
    }

    return {
        exportObject,
        define,
        result: contextWriter.buildST
    }
}

export type RuntimeContext = {
    funcs: any[],
    result: StringTracker,
    define: any
}

export default function exportContext(session: SessionBuild, parser: EJSParser, attributes: StringAnyMap = {}, importSource?: PPath): RuntimeContext {
    const { exportObject, define, result } = createContext(session, parser, attributes, importSource)

    return {
        funcs: Object.values(exportObject),
        result,
        define
    }
}