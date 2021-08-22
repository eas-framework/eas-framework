import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels.js';
import { transform } from 'sucrase';
import { minify } from "terser";
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import EasyFs from '../../OutputInput/EasyFs.js';
import * as svelte from 'svelte/compiler';
import { dirname } from 'path';
import sass from 'sass';
export default async function BuildScript(inputPath, isDebug) {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
    const content = await EasyFs.readFile(fullPath);
    const { code, dependencies, map } = await svelte.preprocess(content, {
        async style({ content, attributes, filename }) {
            const outputStyle = (['sass', 'scss'].includes(attributes.lang) ? SomePlugins("MinSass", "MinAll") : SomePlugins("MinCss", "MinAll")) ? 'compressed' : 'expanded';
            const { css, stats } = await new Promise(resolve => sass.render({
                file: filename,
                indentedSyntax: attributes.lang == 'sass',
                data: content,
                outputStyle,
                includePaths: [
                    dirname(fullPath),
                ],
            }, (err, result) => {
                if (err) {
                    PrintIfNew({
                        text: `${err.message}, on file -> ${inputPath}${err.line ? ':' + err.line : ''}`,
                        errorName: err?.status == 5 ? 'sass-warning' : 'sass-error',
                        type: err?.status == 5 ? 'warn' : 'error'
                    });
                }
                ;
                resolve(result);
            }));
            return {
                code: css.toString(),
                dependencies: stats.includedFiles
            };
        },
        async script({ content, attributes }) {
            if (attributes.lang !== 'ts')
                return;
            try {
                return {
                    code: transform(content, { ...GetPlugin("transformOptions"), transforms: ['typescript'] }).code,
                    dependencies: []
                };
            }
            catch (err) {
                PrintIfNew({
                    errorName: 'compilation-error',
                    text: `${err.message}, on file -> ${fullPath}:${err?.loc?.line ?? 0}:${err?.loc?.column ?? 0}`
                });
            }
        }
    });
    const dependenceObject = {};
    for (const i of dependencies) {
        dependenceObject[i.substring(getTypes.Static[0].length)] = await EasyFs.stat(i, 'mtimeMs');
    }
    const { js, css } = svelte.compile(code, {
        filename: fullPath,
        dev: isDebug,
        sourcemap: map,
        css: false,
        sveltePath: '/serv/svelte'
    });
    const minCode = SomePlugins("MinJS") || SomePlugins("MinAll");
    if (minCode)
        js.code = (await minify(js.code, { module: false })).code;
    if (isDebug) {
        js.map.sources[0] = fullPath.split(/\/|\//).pop() + '?source=true';
        css.map.sources[0] = js.map.sources[0];
        js.code += '\n//# sourceMappingURL=' + js.map.toUrl();
        css.code += '\n/*# sourceMappingURL=' + css.map.toUrl() + '*/';
    }
    await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath, js.code);
    await EasyFs.writeFile(fullCompilePath + '.css', css.code);
    return {
        ...dependenceObject,
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}
//# sourceMappingURL=Svelte.js.map