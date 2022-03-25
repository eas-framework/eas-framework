import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import markdown from 'markdown-it'
import hljs from 'highlight.js';
import { parseTagDataStringBoolean } from './serv-connect/index';
import { createNewPrint } from '../../OutputInput/PrintNew';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs';
import { BasicSettings, getTypes, workingDirectory } from '../../RunTimeBuild/SearchFileSystem';
import anchor from 'markdown-it-anchor';
import slugify from '@sindresorhus/slugify';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAbbr from 'markdown-it-abbr'
import MinCss from '../../CompileCode/CssMinimizer';
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import { print } from '../../OutputInput/Console';

function codeWithCopy(md: any) {

    function renderCode(origRule: any) {
        return (...args: any[]) => {
            const origRendered = origRule(...args);
            return `<div class="code-copy">
                <div>
                    <a href="#copy-clipboard" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">copy</a>
                </div>
                ${origRendered}
            </div>`
        }
    }

    md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block);
    md.renderer.rules.fence = renderCode(md.renderer.rules.fence);
}

export default async function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, session: SessionBuild): Promise<BuildInComponent> {
    const markDownPlugin = InsertComponent.GetPlugin('markdown');

    const hljsClass = parseTagDataStringBoolean(dataTag, 'hljs-class', markDownPlugin?.hljsClass ?? true) ? ' class="hljs"' : '';

    let haveHighlight = false;
    const md = markdown({
        html: true,
        xhtmlOut: true,
        linkify: Boolean(parseTagDataStringBoolean(dataTag, 'linkify', markDownPlugin?.linkify)),
        breaks: Boolean(parseTagDataStringBoolean(dataTag, 'breaks', markDownPlugin?.breaks ?? true)),
        typographer: Boolean(parseTagDataStringBoolean(dataTag, 'typographer', markDownPlugin?.typographer ?? true)),

        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                haveHighlight = true;
                try {
                    return `<pre${hljsClass}><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
                } catch (err) {
                    const [funcName, printText] = createNewPrint({
                        text: err,
                        type: 'error',
                        errorName: 'markdown-parser'
                    })
                    print[funcName](printText)
                }
            }

            return `<pre${hljsClass}><code>${md.utils.escapeHtml(str)}</code></pre>`;
        }
    });

    if (parseTagDataStringBoolean(dataTag, 'copy-code', markDownPlugin?.copyCode ?? true))
        md.use(codeWithCopy);

    if (parseTagDataStringBoolean(dataTag, 'header-link', markDownPlugin?.headerLink ?? true))
        md.use(anchor, {
            slugify: (s: any) => slugify(s),
            permalink: anchor.permalink.headerLink()
        });

    if (parseTagDataStringBoolean(dataTag, 'attrs', markDownPlugin?.attrs ?? true))
        md.use(markdownItAttrs);

    if (parseTagDataStringBoolean(dataTag, 'abbr', markDownPlugin?.abbr ?? true))
        md.use(markdownItAbbr);

    let markdownCode = BetweenTagData?.eq || '';
    const location = dataTag.remove('file');

    if (!markdownCode?.trim?.() && location) {
        let filePath = location[0] == '/' ? getTypes.Static[2] + '/' + location: path.join(path.dirname(type.extractInfo('<line>')), location);
        if (!path.extname(filePath))
            filePath += '.serv.md'
        const fullPath = path.join(BasicSettings.fullWebSitePath, filePath);
        markdownCode = await EasyFs.readFile(fullPath); //get markdown from file
        await session.dependence(filePath, fullPath)
    }

    const renderHTML = md.render(markdownCode), buildHTML = new StringTracker(type.DefaultInfoText);

    const theme = await createAutoTheme(dataTag.remove('code-theme') || markDownPlugin?.codeTheme || 'atom-one');

    if (haveHighlight) {
        const cssLink = '/serv/md/code-theme/' + theme + '.css';
        session.style(cssLink);
    }

    dataTag.addClass('markdown-body');

    const style = parseTagDataStringBoolean(dataTag, 'theme', markDownPlugin?.theme ?? 'auto');
    const cssLink = '/serv/md/theme/' + style + '.css';
    style != 'none' && session.style(cssLink)

    if (dataTag.length)
        buildHTML.Plus$`<div${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${renderHTML}</div>`;
    else
        buildHTML.AddTextAfter(renderHTML);

    return {
        compiledString: buildHTML,
        checkComponents: false
    }
}

const themeArray = ['', '-dark', '-light'];
const themePath = workingDirectory + 'node_modules/github-markdown-css/github-markdown';
export async function minifyMarkdownTheme() {
    for (const i of themeArray) {
        const mini = (await EasyFs.readFile(themePath + i + '.css'))
            .replace(/(\n\.markdown-body {)|(^.markdown-body {)/gm, (match: string) => {
                return match + 'padding:20px;'
            }) + `
            .code-copy>div {
                text-align:right;
                margin-bottom:-30px;
                margin-right:10px;
                opacity:0;
            }
            .code-copy:hover>div {
                opacity:1;
            }
            .code-copy>div a:focus {
                color:#6bb86a
            }`;
        await EasyFs.writeFile(themePath + i + '.min.css', MinCss(mini));
    }
}

function splitStart(text1: string, text2: string) {
    const [before, after, last] = text1.split(/(}|\*\/).hljs{/)
    const addBefore = text1[before.length] == '}' ? '}': '*/';
    return [before +addBefore, '.hljs{' + (last ?? after), '.hljs{' + text2.split(/(}|\*\/).hljs{/).pop()];
}

const codeThemePath = workingDirectory + 'node_modules/highlight.js/styles/';

async function createAutoTheme(theme: string) {
    const darkLightSplit = theme.split('|');
    if (darkLightSplit.length == 1) return theme;

    const name = darkLightSplit[2] || darkLightSplit.slice(0, 2).join('~').replace('/', '-');

    if (await EasyFs.existsFile(codeThemePath + name + '.css'))
        return name;

    const lightText = await EasyFs.readFile(codeThemePath + darkLightSplit[0] + '.css');
    const darkText = await EasyFs.readFile(codeThemePath + darkLightSplit[1] + '.css');

    const [start, dark, light] = splitStart(darkText, lightText);
    const darkLight = `${start}@media(prefers-color-scheme:dark){${dark}}@media(prefers-color-scheme:light){${light}}`;
    await EasyFs.writeFile(codeThemePath + name + '.css', darkLight);

    return name;
}


export function autoCodeTheme() {
    return createAutoTheme('atom-one-light|atom-one-dark|atom-one')
}