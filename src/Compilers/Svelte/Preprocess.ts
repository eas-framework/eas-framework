
import { extname } from 'node:path';
import sass from 'sass';
import { v4 as uuid } from 'uuid';
import PPath from '../../Settings/PPath.js';
import { connectDependencies, importer, style, syntax } from '../Sass/utils.js';
import { GlobalSettings } from '../../Settings/GlobalSettings.js';
import StringTracker from '../../SourceTracker/StringTracker/StringTracker.js';
import EasyFS from '../../Util/EasyFS.js';
import { transform } from '@swc/core';
import { TransformJSC } from '../SWC/Settings.js';
import { getPlugin } from '../../Settings/utils.js';
import { SWCPrintErrorStringTracker } from '../SWC/Errors.js';
import { logSassErrorTracker } from '../Sass/Errors.js';
import DepCreator from '../../ImportSystem/Dependencies/DepCreator.js';
import { locationConnectorPPath } from '../../ImportSystem/unit.js';
import { backToOriginal, backToOriginalSss } from '../../SourceTracker/SourceMap/SourceMapLoad.js';

async function SASSSvelte(content: StringTracker, lang: string, file: PPath, deps: DepCreator) {
    try {
        const { css, sourceMap, loadedUrls } = await sass.compileStringAsync(content.eq, {
            syntax: syntax(<any>lang),
            style: style(lang),
            importer: importer(file),
            logger: sass.Logger.silent,
            sourceMap: true
        });

        await connectDependencies({ loadedUrls }, file, deps);

        return await backToOriginalSss(content, css, <any>sourceMap, sourceMap.sources.find(x => x.startsWith('data:')));
    } catch (err) {
        logSassErrorTracker(err, content);
    }

    return new StringTracker()
}

async function scriptSvelte(content: StringTracker, lang: string, connectSvelte: string[], svelteExt = ''): Promise<StringTracker> {
    const mapToken = {};
    content = content.replacer(/((import({|\s*\(?)|((import\s*type|import|export)({|\s+)[\W\w]+?(}|\s+)from))(}|\s*))(["|'|`])([\W\w]+?)\9(\s*\))?/m, args => {
        if (lang == 'ts' && args[5].endsWith(' type'))
            return args[0];

        const ext = extname(args[10].eq);

        if (ext == '')
            if (lang == 'ts')
                args[10].addTextAfter('.ts');
            else
                args[10].addTextAfter('.js');


        const newData = args[1].plus(args[9], args[10], (ext == '.svelte' ? svelteExt : ''), args[9], (args[11] ?? ''));

        if (ext == '.svelte') {
            connectSvelte.push(args[10].eq);
        } else if (lang !== 'ts' || !args[4])
            return newData;

        const id = uuid();
        mapToken[id] = newData;

        return new StringTracker(`___toKen\`${id}\``);
    });

    try {
        const { code, map } = (await transform(content.eq, {
            jsc: TransformJSC({
                parser: {
                    syntax: 'typescript',
                    ...getPlugin(lang.toUpperCase() +"Options")
                }
            }, { __DEBUG__: '' + GlobalSettings.development }),
            sourceMaps: true,
            ...getPlugin("transformOptions"),
        }));
        content = await backToOriginal(content, code, map);
    } catch (err) {
        SWCPrintErrorStringTracker(content, err);

        return new StringTracker();
    }

    if (lang == 'ts')
        content = content.replacer(/___toKen`([\w\W]+?)`/mi, args => {
            return mapToken[args[1].eq] ?? new StringTracker()
        });

    return content;
}

export async function preprocess(file: PPath, deps: DepCreator, svelteExt = '') {
    const fileContent = await EasyFS.readFile(file.full);
    let text = StringTracker.fromTextFile(fileContent, file);

    let scriptLang = 'js', styleLang = 'css';

    const connectSvelte: string[] = [];
    text = await text.replacerAsync(/(<script)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/script>)/s, async args => {
        scriptLang = args[4]?.eq ?? 'js';
        return args[1].plus(args[6], await scriptSvelte(args[7], scriptLang, connectSvelte, svelteExt), args[8]);
    });

    const styleCode = connectSvelte.map(x => `@import "${x}.css";`).join('');
    let hadStyle = false;
    text = await text.replacerAsync(/(<style)[ ]*( lang=('|")?([A-Za-z]+)('|")?)?[ ]*(>\n?)(.*?)(\n?<\/style>)/s, async args => {
        styleLang = args[4]?.eq ?? 'css';
        if (styleLang == 'css') return args[0];

        const code = await SASSSvelte(args[7], styleLang, file, deps);
        hadStyle = true;
        styleCode && code.addTextAfter(styleCode);
        return args[1].plus(args[6], code, args[8]);;
    });

    if (!hadStyle && styleCode) {
        text.addTextAfter(`<style>${styleCode}</style>`);
    }

    const svelteFiles = connectSvelte.map(location => locationConnectorPPath(location, file))
    return { scriptLang, styleLang, output: text, svelteFiles};
}

