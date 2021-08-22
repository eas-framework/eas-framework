import StringTracker from '../../EasyDebug/StringTracker.js';
import { CreateFilePath } from '../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import { relative } from 'path';
import Base64Id from '../../StringMethods/Id.js';
export default async function BuildCode(path, LastSmallPath, dataTag, sessionInfo) {
    const { SmallPath } = CreateFilePath(path, LastSmallPath, dataTag.remove('from'), getTypes.Static[2], 'svelte');
    const inWebPath = relative(getTypes.Static[2], SmallPath);
    sessionInfo.styleURLSet.push({
        url: '/' + inWebPath + '.css'
    });
    const id = Base64Id(inWebPath);
    const have = (name) => {
        const value = dataTag.remove(name);
        return value ? `,${name}:{${value}}` : '';
    };
    return {
        compiledString: new StringTracker(null, `
        <div id="${id}"></div>
        <script type="module">
            import App_${id} from '/${inWebPath}';
    
            new App_${id}({
                target: document.getElementById("${id}")
                ${have('props') + have('options')}
            });
        </script>`),
        checkComponents: true
    };
}
//# sourceMappingURL=svelte.js.map