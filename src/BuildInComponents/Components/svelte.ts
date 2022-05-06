import StringTracker from '../../EasyDebug/StringTracker';
import { BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id';
import registerExtension from '../../ImportFiles/ForStatic/Svelte/ssr';
import ImportWithoutCache, {  } from '../../ImportFiles/redirectCJS';
import { SessionBuild } from '../../CompileCode/Session';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

async function ssrHTML(dataTag: TagDataParser, FullPath: string, smallPath: string,sessionInfo: SessionBuild) {
    const getV = (name: string) => {
        const gv = (name: string) => dataTag.popOBJ(name),
            value = gv('ssr' +'-' + name) ?? gv(name);

        return value ?? {};
    };
    const buildPath = await registerExtension(FullPath, smallPath, sessionInfo);
    const mode = await ImportWithoutCache(buildPath);

    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}


export default async function BuildCode(type: StringTracker, dataTag: TagDataParser, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const LastSmallPath = type.extractInfo(), LastFullPath = BasicSettings.fullWebSitePath + LastSmallPath;
    const { SmallPath, FullPath } = CreateFilePath(LastFullPath, LastSmallPath, dataTag.popHaveDefault('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');

    sessionInfo.style('/' + inWebPath + '.css');

    const id = dataTag.popAnyDefault('id', Base64Id(inWebPath)),
        have = (name: string) => {
            const value = dataTag.popAnyDefault(name, '').trim();
            return value ? `,${name}:${value || '{}'}` : '';
        }, selector = dataTag.popHaveDefault('selector');

    const ssr = !selector && dataTag.popBoolean('ssr') ? await ssrHTML(dataTag, FullPath, SmallPath, sessionInfo) : '';


    sessionInfo.addScriptStylePage('module', dataTag, type).addText(
`import App${id} from '/${inWebPath}';
const target${id} = document.querySelector("${selector ? selector : '#' + id}");
target${id} && new App${id}({
    target: target${id}
    ${have('props') + have('options')}${ssr ? ', hydrate: true' : ''}
});`);

    return {
        compiledString: new StringTracker(null, selector ? '' : `<div id="${id}">${ssr}</div>`),
        checkComponents: true
    }
}

