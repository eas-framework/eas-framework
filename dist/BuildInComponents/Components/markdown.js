import StringTracker from '../../EasyDebug/StringTracker.js';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import { parseTagDataStringBoolean } from './serv-connect/index.js';
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs.js';
import { BasicSettings, workingDirectory } from '../../RunTimeBuild/SearchFileSystem.js';
import anchor from 'markdown-it-anchor';
import slugify from '@sindresorhus/slugify';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAbbr from 'markdown-it-abbr';
import MinCss from '../../CompileCode/CssMinimizer.js';
function codeWithCopy(md) {
    function renderCode(origRule) {
        return (...args) => {
            const origRendered = origRule(...args);
            return `<div class="code-copy">
                <div>
                    <a href="#copy" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">copy</a>
                </div>
                ${origRendered}
            </div>`;
        };
    }
    md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block);
    md.renderer.rules.fence = renderCode(md.renderer.rules.fence);
}
export default async function BuildCode(type, dataTag, BetweenTagData, InsertComponent, session, dependenceObject) {
    const markDownPlugin = InsertComponent.GetPlugin('markdown');
    const hljsClass = parseTagDataStringBoolean(dataTag, 'hljsClass', markDownPlugin?.hljsClass ?? true) ? ' class="hljs"' : '';
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
                }
                catch (err) {
                    PrintIfNew({
                        text: err,
                        type: 'error',
                        errorName: 'markdown-parser'
                    });
                }
            }
            return `<pre${hljsClass}><code>${md.utils.escapeHtml(str)}</code></pre>`;
        }
    });
    if (parseTagDataStringBoolean(dataTag, 'copy-code', markDownPlugin?.copyCode ?? true))
        md.use(codeWithCopy);
    if (parseTagDataStringBoolean(dataTag, 'header-link', markDownPlugin?.headerLink ?? true))
        md.use(anchor, {
            slugify: (s) => slugify(s),
            permalink: anchor.permalink.headerLink()
        });
    if (parseTagDataStringBoolean(dataTag, 'attrs', markDownPlugin?.attrs ?? true))
        md.use(markdownItAttrs);
    if (parseTagDataStringBoolean(dataTag, 'abbr', markDownPlugin?.abbr ?? true))
        md.use(markdownItAbbr);
    let markdownCode = BetweenTagData?.eq;
    if (!markdownCode) {
        let filePath = path.join(path.dirname(type.extractInfo('<line>')), dataTag.remove('file'));
        if (!path.extname(filePath))
            filePath += '.serv.md';
        const fullPath = path.join(BasicSettings.fullWebSitePath, filePath);
        markdownCode = await EasyFs.readFile(fullPath); //get markdown from file
        dependenceObject[filePath] = await EasyFs.stat(fullPath, 'mtimeMs');
    }
    const renderHTML = md.render(markdownCode), buildHTML = new StringTracker(type.DefaultInfoText);
    const theme = dataTag.remove('codeTheme') || markDownPlugin?.codeTheme || 'atom-one';
    if (haveHighlight) {
        const cssLink = '/serv/md/code-theme/' + theme + '.css';
        if (!session.styleURLSet.find(x => x.url === cssLink))
            session.styleURLSet.push({
                url: cssLink
            });
    }
    dataTag.addClass('markdown-body');
    const style = parseTagDataStringBoolean(dataTag, 'theme', markDownPlugin?.theme ?? 'auto');
    const cssLink = '/serv/md/theme/' + style + '.min.css';
    if (style != 'none' && !session.styleURLSet.find(x => x.url === cssLink))
        session.styleURLSet.push({
            url: cssLink
        });
    if (dataTag.length)
        buildHTML.Plus$ `<div${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${renderHTML}</div>`;
    else
        buildHTML.AddTextAfter(renderHTML);
    return {
        compiledString: buildHTML,
        checkComponents: false
    };
}
const themeArray = ['', '-dark', '-light'];
const themePath = workingDirectory + 'node_modules/github-markdown-css/github-markdown';
export async function minifyMarkdownTheme() {
    for (const i of themeArray) {
        const mini = (await EasyFs.readFile(themePath + i + '.css'))
            .replace(/(\n\.markdown-body {)|(^.markdown-body {)/gm, (match) => {
            return match + 'padding:20px;';
        }) + '.code-copy>div{text-align:right;margin-bottom:-30px;margin-right:10px;}.code-copy>div a:focus{color:#6bb86a}';
        await EasyFs.writeFile(themePath + i + '.min.css', MinCss(mini));
        await EasyFs.unlink(themePath + i + '.css');
    }
}
function splitStart(text1, text2) {
    const [before, after] = text1.split('}.hljs{');
    return [before + '}', '.hljs{' + after, '.hljs{' + text2.split('}.hljs{').pop()];
}
const codeThemePath = workingDirectory + 'node_modules/highlight.js/styles/', codeThemeArray = ['atom-one'];
export async function autoCodeTheme() {
    for (const name of codeThemeArray) {
        const thisPath = codeThemePath + name;
        const darkText = await EasyFs.readFile(thisPath + '-dark.css');
        const lightText = await EasyFs.readFile(thisPath + '-light.css');
        const [start, dark, light] = splitStart(darkText, lightText);
        const darkLight = `${start}@media(prefers-color-scheme:dark){${dark}}@media(prefers-color-scheme:light){${light}}`;
        await EasyFs.writeFile(thisPath + '.css', darkLight);
    }
}
//# sourceMappingURL=markdown.js.map