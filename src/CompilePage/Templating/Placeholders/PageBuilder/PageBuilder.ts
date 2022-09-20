import PPath from "../../../../Settings/PPath.js";
import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker.js";
import { SessionBuild } from "../../../Session.js";
import { BaseParserBlock } from "./BaseParser.js";
import CRunTime from "./CompileRuntime/Compile.js";
import PageParse from "./PageParse.js";
import { checkDynamicSSR, filterInherit } from "./utils.js";

export class PageBuilder extends PageParse {
    inheritValues: BaseParserBlock[]

    constructor(content: StringTracker, public session: SessionBuild) {
        super(content)
    }

    async build(source: PPath, previousSource: PPath) {
        await this.parseBase()

        /* Checks if the SSR is dynamic and check if it has a dynamic attribute, if not skip this SSR  */
        if (this.session.dynamic && !await checkDynamicSSR(this.base, this.session)) {
            return false
        }

        this.parsePlaceHolder()
        this.parseValues()

        this.inheritValues = filterInherit(this.base)
        this.connectBaseToValues()

        const run = new CRunTime(this.content, this.session, source);
        this.content = await run.compile({}, previousSource);
    }

    connectBaseInheritToValues() {
        for (const { value, key } of this.inheritValues) {
            if (value instanceof StringTracker) {
                this.values.push({ value, key })
            }
        }
    }
}