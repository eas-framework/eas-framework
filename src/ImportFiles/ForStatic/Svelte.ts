import { PrintIfNew } from '../../OutputInput/PrintNew';
import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels';
import { StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { transform } from 'sucrase';
import { minify } from "terser";
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import * as svelte from 'svelte/compiler';
import { dirname } from 'path';
import sass from 'sass';

export async function preprocess(fullPath: string, smallPath: string, dependenceObject:StringNumberMap = {}){
    const content = await EasyFs.readFile(fullPath);

    const { code, dependencies, map } =  await svelte.preprocess(content, {
        async style({ content, attributes, filename }) {
            const outputStyle = (['sass', 'scss'].includes(<string>attributes.lang) ? SomePlugins("MinSass", "MinAll") : SomePlugins("MinCss", "MinAll")) ? 'compressed' : 'expanded';

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
                        text: `${err.message}, on file -> ${smallPath}${err.line ? ':' + err.line : ''}`,
                        errorName: err?.status == 5 ? 'sass-warning' : 'sass-error',
                        type: err?.status == 5 ? 'warn' : 'error'
                    });
                };
                resolve(result);
            }));

            return {
                code: css.toString(),
                dependencies: stats.includedFiles
            };
        },
        async script({ content, attributes }) {
            if (attributes.lang !== 'ts') return;

            try {
                return {
                    code: transform(content, { ...GetPlugin("transformOptions"), transforms: ['typescript'] }).code,
                    dependencies: []
                };
            } catch (err) {
                PrintIfNew({
                    errorName: 'compilation-error',
                    text: `${err.message}, on file -> ${fullPath}:${err?.loc?.line ?? 0}:${err?.loc?.column ?? 0}`
                });
            }
        }
    });

    for (const i of dependencies) {
        dependenceObject[i.substring(getTypes.Static[0].length)] = await EasyFs.stat(i, 'mtimeMs');
    }

    return {code, dependenceObject, map};
}


export default async function BuildScript(inputPath: string, isDebug: boolean) {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;

    const { code, dependenceObject, map } = await preprocess(fullPath, inputPath);

    const { js, css } = svelte.compile(code, {
        filename: fullPath,
        dev: isDebug,
        sourcemap: map,
        css: false,
        hydratable: true,
        sveltePath: '/serv/svelte'
    });

    const minCode = SomePlugins("MinJS") || SomePlugins("MinAll");

    if (minCode)
        js.code = (await minify(js.code, { module: false })).code;

    if (isDebug) {
        js.map.sources[0] = fullPath.split(/\/|\//).pop() + '?source=true';
        js.code += '\n//# sourceMappingURL=' + js.map.toUrl();

        if(css.code){
            css.map.sources[0] = js.map.sources[0];
            css.code += '\n/*# sourceMappingURL=' + css.map.toUrl() + '*/';
        }
    }

    await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath, js.code);
    await EasyFs.writeFile(fullCompilePath + '.css', css.code ?? '');

    return {
        ...dependenceObject,
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}