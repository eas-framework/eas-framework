import PPath from '../Settings/PPath.js';
import fullPageBuilder from './Templating/Placeholders/index.js';
import {SessionBuild} from './Session.js';
import ConvertSyntaxRazor from './Templating/RazorTranspiler.js';
import appendComponents from './Templating/Components/index.js';
import rewriteHTMLSyntax from './Templating/HTMLSyntax/index.js';
import {pageBuildHTMLStage1, pageBuildHTMLStage2, pageBuildHTMLStage3, pageBuildStart} from './Events.js';
import {ScriptToEASScriptLastProcesses} from '../Compilers/EASSyntax/Script.js';
import makeCodeAScript, {addScriptTemplate} from './Templating/ScriptTemplate.js';

export default async function compileFullPage(pagePath: PPath) {
    const session = new SessionBuild(pagePath);
    await session.dependencies.updateDep(pagePath);
    await pageBuildStart(pagePath, session);

    let pageContent = await fullPageBuilder(pagePath, session);
    pageContent = await ConvertSyntaxRazor(pageContent);
    pageContent = await appendComponents(pageContent, session);
    pageContent = await rewriteHTMLSyntax(pageContent);

    pageContent = await pageBuildHTMLStage1(pageContent, session);
    pageContent = await makeCodeAScript(pageContent);
    pageContent = await ScriptToEASScriptLastProcesses(pageContent, session);

    pageContent = await pageBuildHTMLStage2(pageContent, session);
    pageContent = await addScriptTemplate(pageContent);
    pageContent = await pageBuildHTMLStage3(pageContent, session);

    return pageContent;
}