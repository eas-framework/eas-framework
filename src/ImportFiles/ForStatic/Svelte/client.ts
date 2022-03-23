import { getTypes } from "../../../RunTimeBuild/SearchFileSystem";
import * as svelte from 'svelte/compiler';
import { preprocess } from "./preprocess";
import { SomePlugins } from "../../../CompileCode/InsertModels";
import { transform } from "esbuild-wasm";
import { PrintIfNew } from "../../../OutputInput/PrintNew";
import EasyFs from "../../../OutputInput/EasyFs";

export default async function BuildScript(inStaticPath: string, isDebug: boolean) {
    const fullPath = getTypes.Static[0] + inStaticPath, fullCompilePath = getTypes.Static[1] + inStaticPath;

    const { code, dependencies, map } = await preprocess(fullPath, getTypes.Static[2] + '/' + inStaticPath);

    const filename = fullPath.split(/\/|\//).pop();
    const { js, css } = svelte.compile(code, {
        filename,
        dev: isDebug,
        sourcemap: map,
        css: false,
        hydratable: true,
        sveltePath: '/serv/svelte'
    });

    if (SomePlugins("MinJS") || SomePlugins("MinAll")) {
        try {
            js.code = (await transform(js.code, {
                minify: true
            })).code
        } catch (err) {
            PrintIfNew({
                errorName: 'minify',
                text: `${err.message} on file -> ${fullPath}`
            })
        }
    }

    if (isDebug) {
        js.map.sources[0].substring(1);
        js.code += '\n//# sourceMappingURL=' + js.map.toUrl();

        if (css.code) {
            css.map.sources[0] = js.map.sources[0];
            css.code += '\n/*# sourceMappingURL=' + css.map.toUrl() + '*/';
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