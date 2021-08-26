import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent, StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionInfo } from '../../CompileCode/XMLHelpers/CompileTypes';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id';
import * as svelte from 'svelte/compiler';
import path from 'path';
import {preprocess} from '../../ImportFiles/ForStatic/Svelte';
//@ts-ignore-next-line
import {RequireCjsScript} from '../../ImportFiles/Script';

function capitalise(name: string) {
    return name[0].toUpperCase() + name.slice(1);
}

async function registerExtension(filePath: string, smallPath: string, dependenceObject: StringNumberMap, isDebug: boolean) {
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
    const { js, warnings } = svelte.compile(context.code, <any>options);

    if (isDebug) {
        warnings.forEach(warning => {
            console.warn(`\nSvelte Warning in ${warning.filename}:`);
            console.warn(warning.message);
            console.warn(warning.frame);
        });
    }

    return await RequireCjsScript(js.code);
}

async function ssrHTML(dataTag: tagDataObjectArray, FullPath: string, smallPath: string, dependenceObject: StringNumberMap, sessionInfo: SessionInfo, isDebug: boolean) {
    const getV = (name: string) => {
        const gv = (name: string) => dataTag.getValue(name).trim(),
        value = gv('ssr' + capitalise(name)) || gv(name);
        
        return value ? eval(`(${value.charAt(0) == '{' ? value : `{${value}}`})`) : {};
    };
    
    const mode = (await registerExtension(FullPath, smallPath, dependenceObject, isDebug));
    const { html, head } = mode.default.render(getV('props'), getV('options'));
    sessionInfo.headHTML += head;
    return html;
}


export default async function BuildCode(path: string, LastSmallPath: string, isDebug: boolean, dataTag: tagDataObjectArray, dependenceObject: StringNumberMap, sessionInfo: SessionInfo): Promise<BuildInComponent> {
    const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath).replace(/\\/gi, '/');

    sessionInfo.styleURLSet.push({
        url: '/' + inWebPath + '.css'
    });

    const id = dataTag.remove('id') || Base64Id(inWebPath),
        have = (name: string) => {
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
                ${have('props') + have('options')}${ssr ? ', hydrate: true': ''}
            });
        </script>`),
        checkComponents: true
    }
}

