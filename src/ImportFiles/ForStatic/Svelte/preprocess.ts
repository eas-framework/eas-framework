import { PrintIfNew } from '../../../OutputInput/PrintNew';
import { SomePlugins, GetPlugin } from '../../../CompileCode/InsertModels';
import { StringNumberMap } from '../../../CompileCode/XMLHelpers/CompileTypes';
import {transform} from 'esbuild-wasm';
import { getTypes, BasicSettings } from '../../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../../OutputInput/EasyFs';
import * as svelte from 'svelte/compiler';
import { dirname, extname } from 'path';
import sass from 'sass';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createImporter, sassStyle, sassSyntax } from '../../../BuildInComponents/Components/style/sass';
import { SessionBuild } from '../../../CompileCode/Session';

async function SASSSvelte(content: string, { lang }, fullPath: string) {
    if (lang == 'css')
        return {
            code: content
        };

    try {
        const { css, loadedUrls } = await sass.compileStringAsync(content, {
            syntax: sassSyntax(lang),
            style: sassStyle(lang, SomePlugins),
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
}

async function addStyleImports(content: string, styleCode:string){

    const { code } = await svelte.preprocess(content, {
        style({ content }) {
            const res = {
                code: styleCode + content,
                dependencies: []
            }

            styleCode = '';

            return res;
        }
    });

    content = code;

    if (styleCode)
        content += `<style>${styleCode}</style>`;

    return content;
}

async function ScriptSvelte(content: string, { lang }, connectSvelte: string[], fullPath: string, svelteExt = '') {
    const mapToken = {};
    content = content.replace(/((import({|[ ]*\(?)|((import|export)({|[ ]+)[\W\w]+?(}|[ ]+)from))(}|[ ]*))(["|'|`])([\W\w]+?)\9([ ]*\)?)/gmi, (substring: string, ...args: any[]) => {
        const ext = extname(args[9]);

        if (ext == '.svelte')
            connectSvelte.push(args[9]);
        else if (ext == '')
            if (lang == 'ts')
                args[9] += '.ts';
            else
                args[9] += '.js';

        const newData = args[0] + args[8] + args[9] + (ext == '.svelte' ? svelteExt : '') + args[8] + (args[10] ?? '');

        if (lang !== 'ts')
            return newData;

        const id = uuid();
        mapToken[id] = newData;

        return newData + `/*uuid-${id}*/`;
    });

    if (lang !== 'ts')
        return {
            code: content
        };

    let tokenCode: string;
    try {
        tokenCode = (await transform(content, { ...GetPlugin("transformOptions"), loader: 'ts' })).code;
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
        return tokenCode.includes(data) ? '' : data;
    });

    return {
        code: tokenCode
    };
}

export async function preprocess(fullPath: string, smallPath: string, svelteExt = '') {
    const content = await EasyFs.readFile(fullPath);

    const connectSvelte = [];
    let { code, dependencies, map } = await svelte.preprocess(content, {
        style({ content, attributes, filename }) {
            return SASSSvelte(content, <any> attributes, filename)
        },
        script({ content, attributes, filename }) {

            return ScriptSvelte(content, <any>attributes, connectSvelte, filename, svelteExt)
        }
    }, {filename: fullPath});

    const sessionInfo = new SessionBuild(smallPath, fullPath), promises = [sessionInfo.dependence(smallPath, fullPath)];
    
    for (const full of (dependencies ?? [])) {
        promises.push(sessionInfo.dependence(BasicSettings.relative(full), full));
    }

    if(connectSvelte.length){
        const styleCode = connectSvelte.map(x => `@import "${x}.css";`).join('');

        code = await addStyleImports(code, styleCode);
    }

    return { code, map, dependencies: sessionInfo.dependencies, svelteFiles: connectSvelte.map(x => path.normalize(fullPath + '/../' + x))};
}

export function Capitalize(name: string) {
    return name[0].toUpperCase() + name.slice(1);
}

