import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, setDataHTMLTag, BuildInComponent, SessionInfo, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import markdown from 'markdown-it'
import hljs from 'highlight.js';
import { parseTagDataStringBoolean } from './serv-connect/index';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs';
import { BasicSettings } from '../../RunTimeBuild/SearchFileSystem';
import anchor from 'markdown-it-anchor';
import slugify from '@sindresorhus/slugify';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAbbr from 'markdown-it-abbr'

export default async function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: any, session: SessionInfo, dependenceObject: StringNumberMap): Promise<BuildInComponent> {
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
                } catch (err) {
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

    if (parseTagDataStringBoolean(dataTag, 'header-link', markDownPlugin?.headerLink ?? true))
        md.use(anchor, {
            slugify: (s: any) => slugify(s),
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
            filePath += '.serv.md'
        const fullPath = path.join(BasicSettings.fullWebSitePath, filePath);
        markdownCode = await EasyFs.readFile(fullPath); //get markdown from file
        dependenceObject[filePath] = await EasyFs.stat(fullPath, 'mtimeMs');
    }

    const renderHTML = md.render(markdownCode), buildHTML = new StringTracker(type.DefaultInfoText);

    const theme = dataTag.remove('codeTheme') || markDownPlugin?.codeTheme || 'atom-one-light';

    if (haveHighlight) {
        const cssLink = '/serv/md/code-theme/' + theme + '.css';
        if (!session.styleURLSet.find(x => x.url === cssLink))
            session.styleURLSet.push({
                url: cssLink
            });
    }

    dataTag.addClass('markdown-body');

    const style = parseTagDataStringBoolean(dataTag, 'theme', markDownPlugin?.theme ?? 'light');

    const cssLink = '/serv/md/theme/' + style + '.css';
    if (style != 'none' && !session.styleURLSet.find(x => x.url === cssLink))
        session.styleURLSet.push({
            url: cssLink
        });

    if (dataTag.length)
        buildHTML.Plus$`<div${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${renderHTML}</div>`;
    else
        buildHTML.AddTextAfter(renderHTML);

    return {
        compiledString: buildHTML,
        checkComponents: false
    }
}