import { createNewPrint } from '../../../OutputInput/PrintNew';
import { SomePlugins, GetPlugin } from '../../../CompileCode/InsertModels';
import { StringNumberMap } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { transform } from 'esbuild-wasm';
import { getTypes, BasicSettings } from '../../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../../OutputInput/EasyFs';
import * as svelte from 'svelte/compiler';
import { dirname, extname } from 'path';
import sass from 'sass';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createImporter, getSassErrorLine, PrintSassError, PrintSassErrorTracker, sassStyle, sassSyntax } from '../../../BuildInComponents/Components/style/sass';
import { SessionBuild } from '../../../CompileCode/Session';
import StringTracker from '../../../EasyDebug/StringTracker';
import { Extension, SplitFirst } from '../../../StringMethods/Splitting';
import { ESBuildPrintErrorStringTracker } from '../../../CompileCode/esbuild/printMessage';
import { backToOriginal, backToOriginalSss } from '../../../EasyDebug/SourceMapLoad';

async function SASSSvelte(content: StringTracker, lang: string, fullPath: string) {
    if (lang == 'css')
        return {
            code: new StringTracker()
        };

    try {
        const { css, sourceMap, loadedUrls } = await sass.compileStringAsync(content.eq, {
            syntax: sassSyntax(<any>lang),
            style: sassStyle(lang, SomePlugins),
            importer: createImporter(fullPath),
            logger: sass.Logger.silent,
            sourceMap: true
        });

        return {
            code: await backToOriginalSss(content, css,<any> sourceMap, sourceMap.sources.find(x => x.startsWith('data:'))),
            dependencies: loadedUrls.map(x => fileURLToPath(<any>x))
        };
    } catch (err) {
        PrintSassErrorTracker(err, content);
    }

    return {
        code: new StringTracker()
    }
}

async function ScriptSvelte(content: StringTracker, lang: string, connectSvelte: string[], svelteExt = ''): Promise<StringTracker> {
    const mapToken = {};
    content = content.replacer(/((import({|[ ]*\(?)|((import[ ]*type|import|export)({|[ ]+)[\W\w]+?(}|[ ]+)from))(}|[ ]*))(["|'|`])([\W\w]+?)\9([ ]*\))?/m, args => {
        if(lang == 'ts' && args[5].endsWith(' type'))
            return args[0];
        
        const ext = extname(args[10].eq);

        if (ext == '')
            if (lang == 'ts')
                args[10].AddTextAfterNoTrack('.ts');
            else
                args[10].AddTextAfterNoTrack('.js');


        const newData = args[1].Plus(args[9], args[10], (ext == '.svelte' ? svelteExt : ''), args[9], (args[11] ?? ''));

        if (ext == '.svelte') {
            connectSvelte.push(args[10].eq);
        } else if (lang !== 'ts' || !args[4])
            return newData;

        const id = uuid();
        mapToken[id] = newData;

        return new StringTracker(null, `___toKen\`${id}\``);
    });

    if (lang !== 'ts')
        return content;

    try {
        const { code, map } = (await transform(content.eq, { ...GetPlugin("transformOptions"), loader: 'ts', sourcemap: true }));
        content = await backToOriginal(content, code, map);
    } catch (err) {
        ESBuildPrintErrorStringTracker(content, err);

        return new StringTracker();
    }

    content = content.replacer(/___toKen`([\w\W]+?)`/mi, args => {
        return mapToken[args[1].eq] ?? new StringTracker()
    });

    return content;
}

export async function preprocess(fullPath: string, smallPath: string, savePath = smallPath, httpSource = true, svelteExt = '') {    
    let text = new StringTracker(smallPath, await EasyFs.readFile(fullPath));

    let scriptLang = 'js', styleLang = 'css';

    const connectSvelte: string[] = [], dependencies: string[] = [];
    text = await text.replacerAsync(/(<script)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/script>)/s, async args => {
        scriptLang = args[4]?.eq ?? 'js';
        return args[1].Plus(args[6], await ScriptSvelte(args[7], scriptLang, connectSvelte, svelteExt), args[8]);
    });

    const styleCode = connectSvelte.map(x => `@import "${x}.css";`).join('');
    let hadStyle = false;
    text = await text.replacerAsync(/(<style)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>)(.*?)(<\/style>)/s, async args => {
        styleLang = args[4]?.eq ?? 'css';
        const { code, dependencies: deps } = await SASSSvelte(args[7], styleLang, fullPath);
        deps && dependencies.push(...deps);
        hadStyle = true;
        styleCode && code.AddTextBeforeNoTrack(styleCode);
        return args[1].Plus(args[6], code, args[8]);;
    });

    if (!hadStyle && styleCode) {
        text.AddTextAfterNoTrack(`<style>${styleCode}</style>`);
    }


    const sessionInfo = new SessionBuild(smallPath, fullPath), promises = [sessionInfo.dependence(smallPath, fullPath)];

    for (const full of dependencies) {
        promises.push(sessionInfo.dependence(BasicSettings.relative(full), full));
    }


    return { scriptLang, styleLang, code: text.eq, map: text.StringTack(savePath, httpSource), dependencies: sessionInfo.dependencies, svelteFiles: connectSvelte.map(x => x[0] == '/' ? getTypes.Static[0] + x : path.normalize(fullPath + '/../' + x)) };
}

export function Capitalize(name: string) {
    return name[0].toUpperCase() + name.slice(1);
}

