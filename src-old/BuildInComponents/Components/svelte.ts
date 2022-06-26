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
import {v4 as uuid} from 'uuid';

async function ssrHTML(dataTag: TagDataParser, FullPath: string, smallPath: string,sessionInfo: SessionBuild) {
    const getV = (name: string) => {
        const gv = (name: string) => dataTag.getOBJ(name),
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
    const { SmallPath, FullPath } = CreateFilePath(LastFullPath, LastSmallPath, dataTag.popHaveDefault('file'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');

    sessionInfo.style('/' + inWebPath + '.css');

    const id = dataTag.popAnyDefault('id', Base64Id(uuid())),
        have = (name: string) => {
            const value = dataTag.popAnyDefault(name, '').trim();
            return value ? `,${name}:${value || '{}'}` : '';
        }, selector = dataTag.popHaveDefault('selector');

    const ssr = !selector && dataTag.popBoolean('ssr') ? await ssrHTML(dataTag, FullPath, SmallPath, sessionInfo) : '';

    const addString = sessionInfo.addScriptStylePage('module', dataTag, type);

    const haveImport = addString.metaMap[inWebPath]; //if this module already imported, not need to import again
    if(!haveImport){ // not imported yet
        addString.metaMap[inWebPath] = id;
    }

    addString.addText(
`${haveImport ? '': `import App${id} from '/${inWebPath}';`}
const target${id} = document.querySelector("${selector ? selector : '#' + id}");
target${id} && new App${haveImport ?? id}({
    target: target${id}
    ${have('props') + have('options')}${ssr ? ', hydrate: true' : ''}
});`);

    return {
        compiledString: new StringTracker(null, selector ? '' : `<div id="${id}">${ssr}</div>`),
        checkComponents: true
    }
}

