import { getTypes } from "../../../RunTimeBuild/SearchFileSystem";
import * as svelte from 'svelte/compiler';
import { preprocess } from "./preprocess";
import { GetPlugin, SomePlugins } from "../../../CompileCode/InsertModels";
import { transform } from "@swc/core";
import EasyFs from "../../../OutputInput/EasyFs";
import { ESBuildPrintErrorSourceMap } from "../../../CompileCode/transpiler/printMessage";
import { toURLComment, MergeSourceMap } from "../../../EasyDebug/SourceMap";
import { createNewPrint } from "../../../OutputInput/Logger";
import { PrintSvelteError, PrintSvelteWarn } from "./error";
import { esTarget, TransformJSC } from "../../../CompileCode/transpiler/settings";

export default async function BuildScript(inStaticPath: string, isDebug: boolean) {
    const fullPath = getTypes.Static[0] + inStaticPath, fullCompilePath = getTypes.Static[1] + inStaticPath;

    const { code, dependencies, map, scriptLang } = await preprocess(fullPath, getTypes.Static[2] + '/' + inStaticPath, isDebug);
    const filename = fullPath.split(/\/|\//).pop();
    let js: any, css: any;
    try {
        const output = svelte.compile(code, {
            filename,
            dev: isDebug,
            sourcemap: map,
            css: false,
            hydratable: true,
            sveltePath: '/serv/svelte'
        });
        PrintSvelteWarn(output.warnings, fullPath, map);
        js = output.js;
        css = output.css;
    } catch(err) {
        PrintSvelteError(err, fullPath, map);
        return {
            thisFile: 0
        };
    }


    const sourceFileClient = js.map.sources[0].substring(1);

    if(isDebug){
        js.map.sources[0] = sourceFileClient;
    }

    if (SomePlugins("MinJS") || SomePlugins("MinAll")) {
        try {
            const { code, map } = await transform(js.code, {
                jsc: TransformJSC({
                    parser:{
                        syntax: scriptLang == 'js' ? 'ecmascript': 'typescript'
                    }
                },null, true),
                minify: true,
                sourceMaps: isDebug
            });

            js.code = code;
            if (map) {
                js.map = await MergeSourceMap(JSON.parse(map), js.map);
            }
        } catch (err) {
            await ESBuildPrintErrorSourceMap(err, js.map, fullPath);
        }
    }

    if (isDebug) {
        js.code += toURLComment(js.map);
        
        if (css.code) {
            css.map.sources[0] = sourceFileClient;
            css.code += toURLComment(css.map, true);
        }
    }

    await EasyFs.makePathReal(inStaticPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath + '.js', js.code);
    await EasyFs.writeFile(fullCompilePath + '.css', css.code ?? '');

    return {
        ...dependencies,
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}