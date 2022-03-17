import StringTracker from '../../EasyDebug/StringTracker.js';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id.js';
import path from 'path';
import { registerExtension, capitalize } from '../../ImportFiles/ForStatic/Svelte.js';
//@ts-ignore-next-line
import ImportWithoutCache, { resolve, clearModule } from '../../ImportFiles/ImportWithoutCache.cjs';
import { parseTagDataStringBoolean } from './serv-connect/index.js';
async function ssrHTML(dataTag, FullPath, smallPath, dependenceObject, sessionInfo, isDebug) {
    const getV = (name) => {
        const gv = (name) => dataTag.getValue(name).trim(), value = gv('ssr' + capitalize(name)) || gv(name);
        return value ? eval(`(${value.charAt(0) == '{' ? value : `{${value}}`})`) : {};
    };
    const newDeps = {};
    const buildPath = await registerExtension(FullPath, smallPath, newDeps, isDebug);
    Object.assign(dependenceObject, newDeps);
    const mode = await ImportWithoutCache(buildPath, isDebug);
    for (const i in newDeps) {
        if (['sass', 'scss', 'css'].includes(path.extname(i).substring(1)))
            continue;
        clearModule(resolve(getTypes.Static[1] + i.substring(getTypes.Static[2].length + 1) + '.ssr.cjs'));
    }
    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}
export default async function BuildCode(path, LastSmallPath, isDebug, type, dataTag, dependenceObject, sessionInfo) {
    const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');
    sessionInfo.style('/' + inWebPath + '.css');
    const id = dataTag.remove('id') || Base64Id(inWebPath), have = (name) => {
        const value = dataTag.getValue(name).trim();
        return value ? `,${name}:${value.charAt(0) == '{' ? value : `{${value}}`}` : '';
    }, selector = dataTag.remove('selector');
    const ssr = !selector && dataTag.have('ssr') ? await ssrHTML(dataTag, FullPath, SmallPath, dependenceObject, sessionInfo, isDebug) : '';
    sessionInfo.addScriptStyle('module', parseTagDataStringBoolean(dataTag, 'page') ? LastSmallPath : type.extractInfo()).addText(`import App${id} from '/${inWebPath}';
const target${id} = document.querySelector("${selector ? selector : '#' + id}");
target${id} && new App${id}({
    target: target${id}
    ${have('props') + have('options')}${ssr ? ', hydrate: true' : ''}
});`);
    return {
        compiledString: new StringTracker(null, selector ? '' : `<div id="${id}">${ssr}</div>`),
        checkComponents: true
    };
}
//# sourceMappingURL=svelte.js.map