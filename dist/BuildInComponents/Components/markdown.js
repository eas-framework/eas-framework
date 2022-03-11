import StringTracker from '../../EasyDebug/StringTracker.js';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import { parseTagDataStringBoolean } from './serv-connect/index.js';
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs.js';
import { BasicSettings } from '../../RunTimeBuild/SearchFileSystem.js';
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