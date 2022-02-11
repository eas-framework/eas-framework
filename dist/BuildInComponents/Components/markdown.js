import StringTracker from '../../EasyDebug/StringTracker.js';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import { parseTagDataStringBoolean } from './serv-connect/index.js';
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
export default async function BuildCode(type, dataTag, BetweenTagData, InsertComponent, session) {
    const markDownPlugin = InsertComponent.GetPlugin('markdown');
    const hljsClass = parseTagDataStringBoolean(dataTag, 'hljsClass', markDownPlugin?.hljsClass ?? true) ? ' class="hljs"' : '';
    let haveHighlight = false;
    const md = markdown({
        html: true,
        xhtmlOut: true,
        linkify: Boolean(parseTagDataStringBoolean(dataTag, 'linkify', markDownPlugin?.linkify)),
        breaks: Boolean(parseTagDataStringBoolean(dataTag, 'breaks', markDownPlugin?.breaks)),
        typographer: Boolean(parseTagDataStringBoolean(dataTag, 'typographer', markDownPlugin?.typographer)),
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
    const renderHTML = md.render(BetweenTagData.eq), buildHTML = new StringTracker(type.DefaultInfoText);
    const theme = dataTag.remove('theme') || markDownPlugin?.theme || 'atom-one-light';
    if (haveHighlight) {
        const cssLink = '/serv/markdown-theme/' + theme + '.css';
        if (!session.styleURLSet.find(x => x.url === cssLink))
            session.styleURLSet.push({
                url: cssLink
            });
    }
    if (dataTag.length)
        buildHTML.Plus$ `<div${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${renderHTML}</div>`;
    else
        buildHTML.AddTextAfter(renderHTML);
    return {
        compiledString: buildHTML,
        checkComponents: false
    };
}
//# sourceMappingURL=markdown.js.map