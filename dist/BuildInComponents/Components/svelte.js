import StringTracker from '../../EasyDebug/StringTracker.js';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id.js';
import { registerExtension, capitalize } from '../../ImportFiles/ForStatic/Svelte.js';
//@ts-ignore-next-line
import ImportWithoutCache, { resolve, clearModule } from '../../ImportFiles/ImportWithoutCache.cjs';
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
        clearModule(resolve(getTypes.Static[1] + i.substring(getTypes.Static[2].length + 1) + '.ssr.cjs'));
    }
    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}
export default async function BuildCode(path, LastSmallPath, isDebug, dataTag, dependenceObject, sessionInfo) {
    const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');
    sessionInfo.styleURLSet.push({
        url: '/' + inWebPath + '.css'
    });
    const id = dataTag.remove('id') || Base64Id(inWebPath), have = (name) => {
        const value = dataTag.getValue(name).trim();
        return value ? `,${name}:${value.charAt(0) == '{' ? value : `{${value}}`}` : '';
    }, selector = dataTag.remove('selector');
    const ssr = !selector && dataTag.have('ssr') ? await ssrHTML(dataTag, FullPath, SmallPath, dependenceObject, sessionInfo, isDebug) : '';
    return {
        compiledString: new StringTracker(null, `
        ${selector ? '' : `<div id="${id}">${ssr}</div>`}
        <script type="module">
            import App${id} from '/${inWebPath}';
            const target${id} = document.querySelector("${selector ? selector : '#' + id}");
            if(target${id})
                new App${id}({
                    target: target${id}
                    ${have('props') + have('options')}${ssr ? ', hydrate: true' : ''}
                });
        </script>`),
        checkComponents: true
    };
}
//# sourceMappingURL=svelte.js.map