import StringTracker from '../../EasyDebug/StringTracker.js';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id.js';
import * as svelte from 'svelte/compiler';
import path from 'path';
import { preprocess } from '../../ImportFiles/ForStatic/Svelte.js';
//@ts-ignore-next-line
import { RequireCjsScript } from '../../ImportFiles/Script.js';
function capitalise(name) {
    return name[0].toUpperCase() + name.slice(1);
}
async function registerExtension(filePath, smallPath, dependenceObject, isDebug) {
    const name = path.parse(filePath).name
        .replace(/^\d/, '_$&')
        .replace(/[^a-zA-Z0-9_$]/g, '');
    const options = {
        filename: filePath,
        name: capitalise(name),
        generate: 'ssr',
        dev: isDebug,
        format: 'cjs'
    };
    const context = await preprocess(filePath, smallPath, dependenceObject);
    const { js, warnings } = svelte.compile(context.code, options);
    if (isDebug) {
        warnings.forEach(warning => {
            console.warn(`\nSvelte Warning in ${warning.filename}:`);
            console.warn(warning.message);
            console.warn(warning.frame);
        });
    }
    return await RequireCjsScript(js.code);
}
async function ssrHTML(dataTag, FullPath, smallPath, dependenceObject, sessionInfo, isDebug) {
    const getV = (name) => {
        const gv = (name) => dataTag.getValue(name).trim(), value = gv('ssr' + capitalise(name)) || gv(name);
        return value ? eval(`(${value.charAt(0) == '{' ? value : `{${value}}`})`) : {};
    };
    const mode = (await registerExtension(FullPath, smallPath, dependenceObject, isDebug));
    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}
export default async function BuildCode(path, LastSmallPath, isDebug, dataTag, dependenceObject, sessionInfo) {
    const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath);
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
            import App_${id} from '/${inWebPath}';
    
            new App_${id}({
                target:  ${selector ? `document.querySelector("${selector}")` : `document.getElementById("${id}")`}
                ${have('props') + have('options')}${ssr ? ', hydrate: true' : ''}
            });
        </script>`),
        checkComponents: true
    };
}
//# sourceMappingURL=svelte.js.map