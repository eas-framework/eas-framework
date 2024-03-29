import {GetPlugin} from '../../../CompileCode/InsertModels';
import {transform} from '@swc/core';
import {BasicSettings, getTypes} from '../../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../../OutputInput/EasyFs';
import {extname} from 'node:path';
import sass from 'sass';
import {v4 as uuid} from 'uuid';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {createImporter, PrintSassErrorTracker, sassStyle, sassSyntax} from '../../../BuildInComponents/Components/style/sass';
import {SessionBuild} from '../../../CompileCode/Session';
import StringTracker from '../../../EasyDebug/StringTracker';
import {ESBuildPrintErrorStringTracker} from '../../../CompileCode/transpiler/printMessage';
import {backToOriginal, backToOriginalSss} from '../../../EasyDebug/SourceMapLoad';
import {TransformJSC} from '../../../CompileCode/transpiler/settings';

async function SASSSvelte(content: StringTracker, lang: string, fullPath: string) {
    try {
        const {css, sourceMap, loadedUrls} = await sass.compileStringAsync(content.eq, {
            syntax: sassSyntax(<any>lang),
            style: sassStyle(lang),
            importer: createImporter(fullPath),
            logger: sass.Logger.silent,
            sourceMap: true
        });

        return {
            code: await backToOriginalSss(content, css, <any>sourceMap, sourceMap.sources.find(x => x.startsWith('data:'))),
            dependencies: loadedUrls.map(x => fileURLToPath(<any>x))
        };
    } catch (err) {
        console.log('sassError', err);
        PrintSassErrorTracker(err, content);
    }

    return {
        code: new StringTracker()
    };
}

async function ScriptSvelte(content: StringTracker, lang: string, connectSvelte: string[], isDebug: boolean, svelteExt = ''): Promise<StringTracker> {
    const mapToken = {};
    content = content.replacer(/((import({|\s*\(?)|((import\s*type|import|export)({|\s+)[\W\w]+?(}|\s+)from))(}|\s*))(["|'|`])([\W\w]+?)\9(\s*\))?/m, args => {
        if (lang == 'ts' && args[5].endsWith(' type'))
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

    try {
        const {code, map} = (await transform(content.eq, {
            jsc: TransformJSC({
                parser: {
                    syntax: 'typescript',
                    ...GetPlugin(lang.toUpperCase() + 'Options')
                }
            }, {__DEBUG__: '' + isDebug}),
            sourceMaps: true,
            ...GetPlugin('transformOptions'),
        }));
        content = await backToOriginal(content, code, map);
    } catch (err) {
        ESBuildPrintErrorStringTracker(content, err, content.extractInfo());

        return new StringTracker();
    }

    if (lang == 'ts')
        content = content.replacer(/___toKen`([\w\W]+?)`/mi, args => {
            return mapToken[args[1].eq] ?? new StringTracker();
        });

    return content;
}

export async function preprocess(fullPath: string, smallPath: string, isDebug: boolean, savePath = smallPath, httpSource = true, svelteExt = '') {
    let text = new StringTracker(smallPath, await EasyFs.readFile(fullPath));

    let scriptLang = 'js', styleLang = 'css';

    const connectSvelte: string[] = [], dependencies: string[] = [];
    text = await text.replacerAsync(/(<script)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/script>)/s, async args => {
        scriptLang = args[4]?.eq ?? 'js';
        return args[1].Plus(args[6], await ScriptSvelte(args[7], scriptLang, connectSvelte, isDebug, svelteExt), args[8]);
    });

    const styleCode = connectSvelte.map(x => `@import "${x}.css";`).join('');
    let hadStyle = false;
    text = await text.replacerAsync(/(<style)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/style>)/s, async args => {
        styleLang = args[4]?.eq ?? 'css';
        if (styleLang == 'css') return args[0];

        const {code, dependencies: deps} = await SASSSvelte(args[7], styleLang, fullPath);
        deps && dependencies.push(...deps);
        hadStyle = true;
        styleCode && code.AddTextBeforeNoTrack(styleCode);
        return args[1].Plus(args[6], code, args[8]);
        ;
    });

    if (!hadStyle && styleCode) {
        text.AddTextAfterNoTrack(`<style>${styleCode}</style>`);
    }


    const sessionInfo = new SessionBuild(smallPath, fullPath), promises = [sessionInfo.dependence(smallPath, fullPath)];

    for (const full of dependencies) {
        promises.push(sessionInfo.dependence(BasicSettings.relative(full), full));
    }


    return {
        scriptLang,
        styleLang,
        code: text.eq,
        map: text.StringTack(savePath, httpSource),
        dependencies: sessionInfo.dependencies,
        svelteFiles: connectSvelte.map(x => x[0] == '/' ? getTypes.Static[0] + x : path.normalize(fullPath + '/../' + x))
    };
}

export function Capitalize(name: string) {
    return name[0].toUpperCase() + name.slice(1);
}

