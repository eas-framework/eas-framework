import { PrintIfNew } from '../../OutputInput/PrintNew';
import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels';
import { StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { transform } from 'sucrase';
import { minify } from "terser";
import { getTypes, BasicSettings } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import * as svelte from 'svelte/compiler';
import { dirname, extname } from 'path';
import sass from 'sass';
import {v4 as uuid} from 'uuid';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createImporter, sassStyle, sassSyntax } from '../../BuildInComponents/Components/style/sass';

export async function preprocess(fullPath: string, smallPath: string, dependenceObject:StringNumberMap = {}, makeAbsolute?: (path: string) => string, svelteExt = ''){
    const content = await EasyFs.readFile(fullPath);

    const addStyle = [];
    const { code, dependencies, map } =  await svelte.preprocess(content, {
        async style({ content, attributes, filename }) {
            
            try {
                const { css, loadedUrls } = await sass.compileStringAsync(content, {
                    syntax: sassSyntax(<any>attributes.lang),
                    style: sassStyle(<string>attributes.lang, SomePlugins),
                    importer: createImporter(fullPath),
                    logger: sass.Logger.silent
                });

                return {
                    code: css,
                    dependencies: loadedUrls.map(x => fileURLToPath(<any>x))
                };
            } catch (err) {
                PrintIfNew({
                    text: `${err.message}, on file -> ${fullPath}${err.line ? ':' + err.line : ''}`,
                    errorName: err?.status == 5 ? 'sass-warning' : 'sass-error',
                    type: err?.status == 5 ? 'warn' : 'error'
                });
            }

            return {
                code: ''
            }
        },
        async script({ content, attributes }) {
            const mapToken = {};
            content = content.replace(/((import({|[ ]*\(?)|((import|export)({|[ ]+)[\W\w]+?(}|[ ]+)from))(}|[ ]*))(["|'|`])([\W\w]+?)\9([ ]*\)?)/gmi, (substring: string, ...args: any[]) => {
                const ext = extname(args[9]);

                if(ext == '.svelte')
                    addStyle.push(args[9]);
                else if(ext == '')
                    if (attributes.lang == 'ts')
                        args[9] += '.ts';
                    else
                        args[9] += '.js';

                const newData = args[0] + args[8] + (makeAbsolute ? makeAbsolute(args[9]): args[9]) + (ext == '.svelte' ? svelteExt: '') + args[8] + (args[10] ?? '');

                if(attributes.lang !== 'ts')
                    return newData;

                const id = uuid();
                mapToken[id] = newData;

                return newData + `/*uuid-${id}*/`;
            });


            if (attributes.lang !== 'ts')             
            return {
                code: content,
                dependencies: []
            };

            let tokenCode: string;
            try {
                tokenCode = transform(content, { ...GetPlugin("transformOptions"), transforms: ['typescript'] }).code;
            } catch (err) {
                PrintIfNew({
                    errorName: 'compilation-error',
                    text: `${err.message}, on file -> ${fullPath}:${err?.loc?.line ?? 0}:${err?.loc?.column ?? 0}`
                });
                return {
                    code: ''
                }
            }

            tokenCode = tokenCode.replace(/\/\*uuid-([\w\W]+?)\*\//gmi, (substring: string, ...args: any) => {
                const data = mapToken[args[0]] ?? '';
                return tokenCode.includes(data) ? '': data;
            });

            return {
                code: tokenCode,
                dependencies: []
            };
        }
    });

    dependencies.push(getTypes.Static[0]+path.relative(getTypes.Static[2], smallPath));
    for (const i of dependencies) {
        dependenceObject[BasicSettings.relative(i)] = await EasyFs.stat(i, 'mtimeMs');
    }

    let fullCode = code;

    if(addStyle.length){
        let styleCode = addStyle.map(x => `@import "${x}.css";`).join('');

        const {code} = await svelte.preprocess(fullCode, {
            style({ content }){
                const res = {
                    code: styleCode + content,
                    dependencies: []
                }
    
                styleCode = '';
    
                return res;
            }
        });

        fullCode = code;

        if(styleCode)
            fullCode += `<style>${styleCode}</style>`;
    }

    return {code: fullCode, dependenceObject, map};
}

export function capitalize(name: string) {
    return name[0].toUpperCase() + name.slice(1);
}

export async function registerExtension(filePath: string, smallPath: string, dependenceObject: StringNumberMap, isDebug: boolean) {
    const name = path.parse(filePath).name
        .replace(/^\d/, '_$&')
        .replace(/[^a-zA-Z0-9_$]/g, '');

    const options = {
        filename: filePath,
        name: capitalize(name),
        generate: 'ssr',
        format: 'cjs',
        dev: isDebug,
    };

    const waitForBuild = [];
    function makeReal(inStatic: string){
        waitForBuild.push(registerExtension(getTypes.Static[0] + inStatic, getTypes.Static[2] + '/' +inStatic, dependenceObject, isDebug));
    }

    const inStaticFile = path.relative(getTypes.Static[2], smallPath), inStaticBasePath = inStaticFile + '/..', fullCompilePath = getTypes.Static[1] + inStaticFile;

    const context = await preprocess(filePath, smallPath, dependenceObject, (importPath: string) => {
        const inStatic = path.relative(inStaticBasePath, importPath);
        makeReal(inStatic);

        return './' +inStatic.replace(/\\/gi, '/');
    }, '.ssr.cjs');


    await Promise.all(waitForBuild);
    const { js, css, warnings } = svelte.compile(context.code, <any>options);

    if (isDebug) {
        warnings.forEach(warning => {
            PrintIfNew({
                errorName: warning.code,
                type: 'warn',
                text: warning.message + '\n' + warning.frame
            });
        });
    }

    const fullImportPath = fullCompilePath + '.ssr.cjs';
    await EasyFs.writeFile(fullImportPath, js.code);

    if(css.code){
        css.map.sources[0] = '/'+inStaticFile.split(/\/|\//).pop() + '?source=true';
        css.code += '\n/*# sourceMappingURL=' + css.map.toUrl() + '*/';
    }

    await EasyFs.writeFile(fullCompilePath + '.css', css.code ?? '');

    return fullImportPath;
}

export default async function BuildScript(inputPath: string, isDebug: boolean) {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;

    const { code, dependenceObject, map } = await preprocess(fullPath, getTypes.Static[2] + '/' + inputPath);

    const { js, css } = svelte.compile(code, {
        filename: fullPath,
        dev: isDebug,
        sourcemap: map,
        css: false,
        hydratable: true,
        sveltePath: '/serv/svelte'
    });

    if (SomePlugins("MinJS") || SomePlugins("MinAll")){
        try {
            js.code = (await minify(js.code, { module: false })).code;
        } catch (err) {
            PrintIfNew({
                errorName: 'minify',
                text: `${err.message} on file -> ${fullPath}`
            })
        }
    }

    if (isDebug) {
        js.map.sources[0] = fullPath.split(/\/|\//).pop() + '?source=true';
        js.code += '\n//# sourceMappingURL=' + js.map.toUrl();

        if(css.code){
            css.map.sources[0] = js.map.sources[0];
            css.code += '\n/*# sourceMappingURL=' + css.map.toUrl() + '*/';
        }
    }

    await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath + '.js', js.code);
    await EasyFs.writeFile(fullCompilePath + '.css', css.code ?? '');

    return {
        ...dependenceObject,
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}