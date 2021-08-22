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
        const value = dataTag.remove(name);
        return value ? `,${name}:{${value}}`: '';
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
    }
}

