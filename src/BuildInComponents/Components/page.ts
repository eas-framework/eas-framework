import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import path_node from 'path';
import { SessionBuild } from '../../CompileCode/Session';
import { CheckDependencyChange } from '../../OutputInput/StoreDeps';

function InFolderPagePath(inputPath: string, fullPath:string){
    if (inputPath[0] == '.') {
        if (inputPath[1] == '/') {
            inputPath = inputPath.substring(2);
        } else {
            inputPath = inputPath.substring(1);
        }
        let folder = path_node.dirname(fullPath).substring(getTypes.Static[0].length);

        if(folder){
            folder += '/';
        }
        inputPath = folder + inputPath;
    } else if (inputPath[0] == '/') {
        inputPath = inputPath.substring(1);
    }

    const pageType = '.' + BasicSettings.pageTypes.page;
    if(!inputPath.endsWith(pageType)){
        inputPath += pageType;
    }

    return inputPath;
}

const cacheMap: { [key: string]: {CompiledData: StringTracker, dependence: StringNumberMap, newSession: SessionBuild}} = {};
export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const filepath = dataTag.getValue("from");

    const SmallPathWithoutFolder = InFolderPagePath(filepath, path);

    const FullPath = getTypes.Static[0] + SmallPathWithoutFolder, SmallPath = getTypes.Static[2] + '/' + SmallPathWithoutFolder;

    if (!(await EasyFs.stat(FullPath, null, true)).isFile?.()) {
        PrintIfNew({
            text: `\nPage not found: ${type.at(0).lineInfo} -> ${FullPath}`,
            errorName: 'page-not-found',
            type: 'error'
        });
        return {
            compiledString: new StringTracker(type.DefaultInfoText, `<p style="color:red;text-align:left;font-size:16px;">Page not found: ${type.lineInfo} -> ${SmallPath}</p>`)
        };
    }

    let ReturnData: StringTracker;

    const haveCache = cacheMap[SmallPathWithoutFolder];
    if (!haveCache || await CheckDependencyChange(null, haveCache.dependence)) {
        const { CompiledData, dependenceObject: dependence , sessionInfo: newSession} = await InsertComponent.CompileInFile(SmallPathWithoutFolder, getTypes.Static, null, pathName, dataTag.remove('object'));
        dependence[SmallPath] = dependence.thisPage;
        delete dependence.thisPage;

        sessionInfo.extends(newSession)

        cacheMap[SmallPathWithoutFolder] = {CompiledData, dependence, newSession};
        Object.assign(dependenceObject, dependence);
        ReturnData = CompiledData;
    } else {
        const { CompiledData, dependence, newSession } = cacheMap[SmallPathWithoutFolder];
   
        Object.assign(dependenceObject, dependence);
        sessionInfo.extends(newSession)

        ReturnData = CompiledData;
    }

    return {
        compiledString: ReturnData
    }
}