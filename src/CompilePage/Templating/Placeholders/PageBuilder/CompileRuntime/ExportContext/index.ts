import path from "path";
import { locationConnectorPPath } from "../../../../../../ImportSystem/unit";
import createDateWriter from "../../../../../../RuntimeUtils/DataWriter";
import PPath from "../../../../../../Settings/PPath";
import { StringAnyMap } from "../../../../../../Settings/types";
import StringTracker from "../../../../../../SourceTracker/StringTracker/StringTracker";
import { SessionBuild } from "../../../../../Session";
import renderAttrs, { addImportSource } from "./renderAttrs";

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
    CREATE_DATE_WRITER = 'createDateWriter',
    ATTRDEFAULT = 'attrdefault'

export const COMPILE_PARAMS = [SCRIPT, STYLE, DEFINE, STORE, PAGE_FILENAME, PAGE_DIRNAME, LOCALPATH, ATTRIBUTES, DEPENDENCE, ATTRS_HTML, ATTRS_OBJECT_HTML, CREATE_DATE_WRITER, ATTRDEFAULT]

type Writer = { text: string }
function createContext(session: SessionBuild, attributes: StringAnyMap = {}, importSource?: PPath) {
    if (importSource) {
        addImportSource(attributes, importSource)
    }

    const define = {}
    const writerArray: Writer[] = []

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
            session.dependence(
                locationConnectorPPath(file, session.file)
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
        [CREATE_DATE_WRITER](data: Writer) {
            writerArray.unshift(data);
            return createDateWriter(data)
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

    return { exportObject, define, writerArray }
}

export type RuntimeContext = {
    funcs: any[],
    writerArray: Writer[],
    define: any
}

export default function exportContext(session: SessionBuild, attributes: StringAnyMap = {}, importSource?: PPath): RuntimeContext {
    const { exportObject, define, writerArray } = createContext(session, attributes, importSource)

    return {
        funcs: Object.values(exportObject),
        writerArray,
        define
    }
}