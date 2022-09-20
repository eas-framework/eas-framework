import assert from "assert";
import { SessionBuild } from "../../src/CompilePage/Session.js";
import CRunTime from "../../src/CompilePage/Templating/Placeholders/PageBuilder/CompileRuntime/Compile.js";
import { GlobalSettings } from "../../src/Settings/GlobalSettings.js";
import PPath from "../../src/Settings/PPath.js";
import { compileRuntimeScript, compileRuntimeScriptExpectedResult, compileRuntimeScriptExpectedResultPRODUCTION, MOCK_SESSION, SOURCE_FILE } from "./contents/compileRuntime.js";

describe('Compile Runtime',  () => {
    it('compile eas script to JavaScript', async () => {
        GlobalSettings.development = true

        const run = new CRunTime(compileRuntimeScript, MOCK_SESSION, SOURCE_FILE);
        const content = await run.compile({}, MOCK_SESSION.file);
        assert.equal(compileRuntimeScriptExpectedResult, content.eq)
    })

    it('compile eas script to JavaScript PRODUCTION', async () => {
        GlobalSettings.development = false

        const run = new CRunTime(compileRuntimeScript, MOCK_SESSION, SOURCE_FILE);
        const content = await run.compile({},  MOCK_SESSION.file);
        assert.equal(compileRuntimeScriptExpectedResultPRODUCTION, content.eq)
    })
})