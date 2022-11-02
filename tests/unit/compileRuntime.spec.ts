import assert from "assert";
import CRunTime from "../../src/CompilePage/Templating/Placeholders/PageBuilder/CompileRuntime/Compile.js";
import {GlobalSettings} from "../../src/Settings/GlobalSettings.js";
import {
    compileRuntimeScript,
    compileRuntimeScriptExpectedResult,
    compileRuntimeScriptExpectedResultPRODUCTION,
    getMockModel,
    getMockSession,
} from "./contents/compileRuntime.js";
import {setDirectoriesToSampleWebsite} from './contents/mock-website.js';

describe('Compile Runtime', () => {
    setDirectoriesToSampleWebsite();

    const session = getMockSession();
    const sourceFile = getMockModel();
    it('compile eas script to JavaScript', async () => {
        GlobalSettings.development = true;

        const run = new CRunTime(compileRuntimeScript, session, sourceFile);
        const content = await run.compile({}, session.file);
        assert.equal(compileRuntimeScriptExpectedResult, content.eq);
    });

    it('compile eas script to JavaScript PRODUCTION', async () => {
        GlobalSettings.development = false;

        const run = new CRunTime(compileRuntimeScript, session, sourceFile);
        const content = await run.compile({}, session.file);
        assert.equal(compileRuntimeScriptExpectedResultPRODUCTION, content.eq);
    });
});