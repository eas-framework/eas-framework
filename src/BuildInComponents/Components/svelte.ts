import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent, StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { BasicSettings, getTypes, SystemData } from '../../RunTimeBuild/SearchFileSystem';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id';
import * as svelte from 'svelte/compiler';
import path from 'path';
import registerExtension from '../../ImportFiles/ForStatic/Svelte/ssr';
import { rebuildFile } from '../../ImportFiles/StaticFiles';
//@ts-ignore-next-line
import ImportWithoutCache, { resolve, clearModule } from '../../ImportFiles/redirectCJS';
import { SessionBuild } from '../../CompileCode/Session';
import { parseTagDataStringBoolean } from './serv-connect/index';
import { Capitalize } from '../../ImportFiles/ForStatic/Svelte/preprocess';

async function ssrHTML(dataTag: tagDataObjectArray, FullPath: string, smallPath: string,sessionInfo: SessionBuild) {
    const getV = (name: string) => {
        const gv = (name: string) => dataTag.getValue(name).trim(),
            value = gv('ssr' + Capitalize(name)) || gv(name);

        return value ? eval(`(${value.charAt(0) == '{' ? value : `{${value}}`})`) : {};
    };
    const buildPath = await registerExtension(FullPath, smallPath, sessionInfo);
    const mode = await ImportWithoutCache(buildPath);

    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}


export default async function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const LastSmallPath = type.extractInfo(), LastFullPath = BasicSettings.fullWebSitePath + LastSmallPath;
    const { SmallPath, FullPath } = CreateFilePath(LastFullPath, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');

    sessionInfo.style('/' + inWebPath + '.css');

    const id = dataTag.remove('id') || Base64Id(inWebPath),
        have = (name: string) => {
            const value = dataTag.getValue(name).trim();
            return value ? `,${name}:${value.charAt(0) == '{' ? value : `{${value}}`}` : '';
        }, selector = dataTag.remove('selector');

    const ssr = !selector && dataTag.have('ssr') ? await ssrHTML(dataTag, FullPath, SmallPath, sessionInfo) : '';


    sessionInfo.addScriptStyle('module', parseTagDataStringBoolean(dataTag, 'page') ? LastSmallPath : type.extractInfo()).addText(
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

