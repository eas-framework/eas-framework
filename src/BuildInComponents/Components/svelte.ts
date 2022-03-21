import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent, StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { getTypes, SystemData } from '../../RunTimeBuild/SearchFileSystem';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id';
import * as svelte from 'svelte/compiler';
import path from 'path';
import { registerExtension, capitalize } from '../../ImportFiles/ForStatic/Svelte';
import { rebuildFile } from '../../ImportFiles/StaticFiles';
//@ts-ignore-next-line
import ImportWithoutCache, { resolve, clearModule } from '../../ImportFiles/redirectCJS';
import { SessionBuild } from '../../CompileCode/Session';
import { parseTagDataStringBoolean } from './serv-connect/index';

async function ssrHTML(dataTag: tagDataObjectArray, FullPath: string, smallPath: string, dependenceObject: StringNumberMap, sessionInfo: SessionBuild, isDebug: boolean) {
    const getV = (name: string) => {
        const gv = (name: string) => dataTag.getValue(name).trim(),
            value = gv('ssr' + capitalize(name)) || gv(name);

        return value ? eval(`(${value.charAt(0) == '{' ? value : `{${value}}`})`) : {};
    };
    const newDeps = {};
    const buildPath = await registerExtension(FullPath, smallPath, newDeps, isDebug);
    Object.assign(dependenceObject, newDeps);

    const mode = await ImportWithoutCache(buildPath);

    for (const i in newDeps) {
        if(['sass', 'scss', 'css'].includes(path.extname(i).substring(1)))
            continue;
        clearModule(resolve(getTypes.Static[1] + i.substring(getTypes.Static[2].length + 1) + '.ssr.cjs'));
    }

    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}


export default async function BuildCode(path: string, LastSmallPath: string, isDebug: boolean, type: StringTracker, dataTag: tagDataObjectArray, dependenceObject: StringNumberMap, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');

    sessionInfo.style('/' + inWebPath + '.css');

    const id = dataTag.remove('id') || Base64Id(inWebPath),
        have = (name: string) => {
            const value = dataTag.getValue(name).trim();
            return value ? `,${name}:${value.charAt(0) == '{' ? value : `{${value}}`}` : '';
        }, selector = dataTag.remove('selector');

    const ssr = !selector && dataTag.have('ssr') ? await ssrHTML(dataTag, FullPath, SmallPath, dependenceObject, sessionInfo, isDebug) : '';


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

