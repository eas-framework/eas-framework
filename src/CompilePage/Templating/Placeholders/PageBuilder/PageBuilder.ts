import PPath from "../../../../Settings/PPath";
import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker";
import { SessionBuild } from "../../../Session";
import { BaseParserBlock } from "./BaseParser";
import CRunTime from "./CompileRuntime/Compile";
import PageParse from "./PageParse";
import { checkDynamicSSR, filterInherit } from "./utils";

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

    connectBaseToValues() {
        for (const { value, key } of this.inheritValues) {
            if (value instanceof StringTracker) {
                this.values.push({ value, key })
            }
        }
    }
}