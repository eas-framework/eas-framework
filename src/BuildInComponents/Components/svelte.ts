import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { SessionInfo } from '../../CompileCode/XMLHelpers/CompileTypes';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id';

export default async function BuildCode(path: string, LastSmallPath: string, dataTag: tagDataObjectArray, sessionInfo: SessionInfo): Promise<BuildInComponent> {
    const { SmallPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath);    

    sessionInfo.styleURLSet.push({
        url: '/' + inWebPath + '.css'
    });

    const id = Base64Id(inWebPath);

    const have = (name:string) =>{
        const value = dataTag.remove(name).trim();
        return value ? `,${name}:${value.charAt(0) == '{' ? value: `{${value}}`}`: '';
    };

    const selector = dataTag.remove('selector');
    
    return {
        compiledString: new StringTracker(null, `
        ${selector ? '': `<div id="${id}"></div>`}
        <script type="module">
            import App_${id} from '/${inWebPath}';
    
            new App_${id}({
                target:  ${selector ? `document.querySelector("${selector}")`: `document.getElementById("${id}")`}
                ${have('props') + have('options')}
            });
        </script>`),
        checkComponents: true
    }
}

