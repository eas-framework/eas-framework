import { transform } from "@swc/core";
import assert from "assert";
import { defaultVariables, GetScriptSettings, TransformJSC } from "../../src/Compilers/SWC/Settings.js";
import { exampleScript, exampleScriptExpectedOutput } from "./contents/easJS.js";
import { fileURLToPath } from 'url';
const PLUGIN_URL = fileURLToPath(new URL('../../src/StaticFiles/wasm/easSyntax/build.wasm', import.meta.url));
const options = {
    jsc: TransformJSC({
        parser: {
            ...GetScriptSettings(false),
            importAssertions: true
        },
        experimental: {
            keepImportAssertions: true,
            plugins: [
                [
                    PLUGIN_URL,
                    {
                        importMethod: "require4",
                        stopMethod: "stop",
                        stopMethodToKeyword: "return"
                    }
                ]
            ],
        },
    }, defaultVariables(), true),
    minify: false
};
describe('EAS JS Syntax', () => {
    it('Simple swc compile test', async () => {
        const { code, map } = await transform(exampleScript, options);
        assert.equal(code, exampleScriptExpectedOutput);
    });
});
