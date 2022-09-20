import { transform, Options as transformOptions } from "@swc/core";
import assert from "assert";
import { defaultVariables, GetScriptSettings, TransformJSC, TRANSFORM_MODULE } from "../../src/Compilers/SWC/Settings.js";
import { exampleScript } from "./contents/easJS.js";
import { fileURLToPath } from 'url'

const PLUGIN_URL = fileURLToPath(new URL('../../src/static/wasm/easSyntax/build.wasm', import.meta.url))

const options: transformOptions = {

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
    minify: true
};

describe('EAS JS Syntax', () => {
    it('Simple swc compile test', async () => {
        const { code, map } = await transform(exampleScript, options);
        assert.equal(code,
            `var _ddd=await require4("ddd");_export(exports,{a:()=>_ddd.a,b:()=>_ddd.b,c:()=>_ddd.c,k:()=>e,default:()=>me});var{default:Moo,bb:a1,cc}=await require4("./ddd",{type:"json"});Moo();a();bb();cc();await require4("fff");await require4("jdrjj");_return(2);_return;function me(){}`
        )

    })
})
